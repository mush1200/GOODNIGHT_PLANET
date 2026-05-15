import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

import { notificationSoundForProfile } from '../nightSoundscape';
import type { SoundProfile } from '../soundProfile';

export type ReminderPreview = {
  mock: boolean;
  channel: 'push';
  templateKey: 'evening_nudge' | 'ritual_invite';
  deviceId: string;
  pushEmotionalState?: string;
  title?: string;
  petArchetype?: string;
  body: string;
};

export type PushRegistration = {
  enabled: boolean;
  expoPushToken: string | null;
};

let registration: PushRegistration = { enabled: false, expoPushToken: null };

Notifications.setNotificationHandler({
  handleNotification: async (notification) => ({
    shouldShowAlert: true,
    shouldPlaySound: Boolean(notification.request.content.sound),
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function getPushRegistration(): PushRegistration {
  return registration;
}

export async function registerForPushNotifications(): Promise<PushRegistration> {
  if (!Device.isDevice) {
    registration = { enabled: false, expoPushToken: null };
    return registration;
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;
  if (existing !== 'granted') {
    const requested = await Notifications.requestPermissionsAsync();
    finalStatus = requested.status;
  }

  if (finalStatus !== 'granted') {
    registration = { enabled: false, expoPushToken: null };
    return registration;
  }

  const token = await Notifications.getExpoPushTokenAsync();
  registration = { enabled: true, expoPushToken: token.data };
  return registration;
}

export function secondsUntilNextLocalHm(hm: string, now = new Date()): number {
  const [hour, minute] = hm.split(':').map(Number);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return 60;
  const target = new Date(now);
  target.setHours(hour, minute, 0, 0);
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1);
  }
  return Math.max(60, Math.round((target.getTime() - now.getTime()) / 1000));
}

export async function scheduleInAppReminder(
  preview: ReminderPreview,
  anchorTimeLocal?: string | null,
  soundProfile?: SoundProfile,
): Promise<string | null> {
  if (!registration.enabled) return null;

  const seconds = anchorTimeLocal ? secondsUntilNextLocalHm(anchorTimeLocal) : 60;
  const sound = soundProfile ? notificationSoundForProfile(soundProfile) : null;

  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: preview.title ?? 'Goodnight Planet',
      body: preview.body,
      sound,
      data: {
        templateKey: preview.templateKey,
        deviceId: preview.deviceId,
        mock: preview.mock,
        pushEmotionalState: preview.pushEmotionalState,
      },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds,
    },
  });

  return identifier;
}

export async function cancelScheduledReminders(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
