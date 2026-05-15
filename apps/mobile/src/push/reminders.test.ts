import { beforeEach, describe, expect, it, vi } from 'vitest';

const expoMocks = vi.hoisted(() => ({
  scheduleNotificationAsync: vi.fn(async () => 'reminder-1'),
  requestPermissionsAsync: vi.fn(async () => ({ status: 'granted' as const })),
  getPermissionsAsync: vi.fn(async () => ({ status: 'granted' as const })),
  getExpoPushTokenAsync: vi.fn(async () => ({ data: 'ExponentPushToken[test]' })),
}));

vi.mock('expo-device', () => ({
  isDevice: true,
}));

vi.mock('expo-notifications', () => ({
  setNotificationHandler: vi.fn(),
  SchedulableTriggerInputTypes: { TIME_INTERVAL: 'timeInterval' },
  getPermissionsAsync: expoMocks.getPermissionsAsync,
  requestPermissionsAsync: expoMocks.requestPermissionsAsync,
  getExpoPushTokenAsync: expoMocks.getExpoPushTokenAsync,
  scheduleNotificationAsync: expoMocks.scheduleNotificationAsync,
  cancelAllScheduledNotificationsAsync: vi.fn(async () => undefined),
}));

import {
  cancelScheduledReminders,
  getPushRegistration,
  registerForPushNotifications,
  scheduleInAppReminder,
} from './reminders';

describe('push registration (7.2.6)', () => {
  beforeEach(() => {
    expoMocks.scheduleNotificationAsync.mockClear();
    expoMocks.requestPermissionsAsync.mockClear();
    expoMocks.getPermissionsAsync.mockClear();
    expoMocks.getExpoPushTokenAsync.mockClear();
  });

  it('registers an expo push token on device', async () => {
    const reg = await registerForPushNotifications();
    expect(reg.enabled).toBe(true);
    expect(getPushRegistration().expoPushToken).toBe('ExponentPushToken[test]');
  });

  it('schedules an in-app reminder from preview payload', async () => {
    await registerForPushNotifications();
    const id = await scheduleInAppReminder({
      mock: true,
      channel: 'push',
      templateKey: 'evening_nudge',
      deviceId: 'gp_test',
      title: '晚安',
      body: '小屋的燈還幫你留著。',
    });
    expect(id).toBe('reminder-1');
    expect(expoMocks.scheduleNotificationAsync).toHaveBeenCalledOnce();
  });

  it('uses whisper sound only when sound profile allows notification audio', async () => {
    await registerForPushNotifications();
    await scheduleInAppReminder(
      {
        mock: true,
        channel: 'push',
        templateKey: 'evening_nudge',
        deviceId: 'gp_test',
        title: '小屋裡還亮著燈',
        body: '今晚的風有點安靜。',
      },
      '23:00',
      {
        materialKey: 'window_air',
        uiConfirmAssetKey: 'ui_confirm_night_owl',
        ritualBreathAssetKey: 'ritual_breath_night_owl',
        ambientBedAssetKey: null,
        revealAssetKey: 'reveal_unbox',
        transitionAssetKey: 'transition_soft',
        notificationSoundKey: 'push_goodnight_whisper',
        breathCycleMs: 2200,
        allowAmbientBed: false,
        allowUiClick: false,
        allowBreathPulse: false,
        playNotificationSound: true,
      },
    );
    const content = expoMocks.scheduleNotificationAsync.mock.calls[0]?.[0]?.content as {
      sound?: string | null;
    };
    expect(content.sound).toBe('push_goodnight_whisper');
  });

  it('mutes notification sound when night sound is off', async () => {
    await registerForPushNotifications();
    await scheduleInAppReminder(
      {
        mock: true,
        channel: 'push',
        templateKey: 'evening_nudge',
        deviceId: 'gp_test',
        title: '小屋裡還亮著燈',
        body: '今晚的風有點安靜。',
      },
      '23:00',
      {
        materialKey: 'wood_lamp',
        uiConfirmAssetKey: 'ui_confirm_gentle',
        ritualBreathAssetKey: 'ritual_breath_gentle',
        ambientBedAssetKey: null,
        revealAssetKey: 'reveal_unbox',
        transitionAssetKey: 'transition_soft',
        notificationSoundKey: 'silent',
        breathCycleMs: 2200,
        allowAmbientBed: false,
        allowUiClick: false,
        allowBreathPulse: false,
        playNotificationSound: false,
      },
    );
    const content = expoMocks.scheduleNotificationAsync.mock.calls.at(-1)?.[0]?.content as {
      sound?: string | null;
    };
    expect(content.sound).toBeNull();
  });

  it('clears scheduled reminders', async () => {
    await expect(cancelScheduledReminders()).resolves.toBeUndefined();
  });
});
