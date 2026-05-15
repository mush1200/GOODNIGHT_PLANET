import { describe, expect, it } from 'vitest';

import { buildPushSoundProfile } from './reminderSoundProfile';

describe('reminderSoundProfile', () => {
  it('mutes push audio when night sound is off', () => {
    const profile = buildPushSoundProfile({
      archetype: 'gentle',
      reducedMotion: false,
      soundEnabled: true,
      nightSoundEnabled: false,
      pushReminderEnabled: true,
    });
    expect(profile.playNotificationSound).toBe(false);
    expect(profile.notificationSoundKey).toBe('silent');
  });

  it('keeps archetype-specific whisper keys when night sound is on', () => {
    const sleepy = buildPushSoundProfile({
      archetype: 'sleepy',
      reducedMotion: false,
      soundEnabled: true,
      nightSoundEnabled: true,
      pushReminderEnabled: true,
    });
    const nightOwl = buildPushSoundProfile({
      archetype: 'night_owl',
      reducedMotion: false,
      soundEnabled: true,
      nightSoundEnabled: true,
      pushReminderEnabled: true,
    });
    expect(sleepy.playNotificationSound).toBe(true);
    expect(nightOwl.playNotificationSound).toBe(true);
    expect(sleepy.materialKey).not.toBe(nightOwl.materialKey);
  });
});
