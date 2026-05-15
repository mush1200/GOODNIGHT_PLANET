import { describe, expect, it, vi } from 'vitest';

vi.mock('expo-notifications', () => ({
  setNotificationHandler: () => {},
  SchedulableTriggerInputTypes: { TIME_INTERVAL: 'timeInterval' },
  scheduleNotificationAsync: async () => 'id',
  cancelAllScheduledNotificationsAsync: async () => {},
}));

vi.mock('expo-device', () => ({
  isDevice: false,
}));

import { secondsUntilNextLocalHm } from './reminders';

describe('push schedule anchor (9.6.1)', () => {
  it('anchors interval to target sleep local time', () => {
    const now = new Date('2026-05-13T20:00:00');
    const seconds = secondsUntilNextLocalHm('23:00', now);
    expect(seconds).toBe(3 * 60 * 60);
  });
});
