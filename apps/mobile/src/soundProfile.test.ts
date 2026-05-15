import { describe, expect, it } from 'vitest';

import { resolveEmotionalPacing } from './emotionalPacing';
import { notificationSoundForProfile } from './nightSoundscape';
import { resolveSoundProfile } from './soundProfile';

describe('soundProfile (sound_direction)', () => {
  it('maps archetypes to distinct materials', () => {
    const sleepy = resolveSoundProfile({
      archetype: 'sleepy',
      pacing: resolveEmotionalPacing({ phase: 'home' }),
      reduceMotion: false,
      soundEnabled: true,
      nightSoundEnabled: true,
      pushSoundEnabled: true,
    });
    const nightOwl = resolveSoundProfile({
      archetype: 'night_owl',
      pacing: resolveEmotionalPacing({ phase: 'home' }),
      reduceMotion: false,
      soundEnabled: true,
      nightSoundEnabled: true,
      pushSoundEnabled: true,
    });
    expect(sleepy.materialKey).toBe('cotton_muffled');
    expect(nightOwl.materialKey).toBe('window_air');
    expect(sleepy.uiConfirmAssetKey).not.toBe(nightOwl.uiConfirmAssetKey);
  });

  it('mutes notification sound when night sound is off', () => {
    const profile = resolveSoundProfile({
      archetype: 'gentle',
      pacing: resolveEmotionalPacing({ phase: 'home' }),
      reduceMotion: false,
      soundEnabled: true,
      nightSoundEnabled: false,
      pushSoundEnabled: true,
    });
    expect(notificationSoundForProfile(profile)).toBeNull();
    expect(profile.allowAmbientBed).toBe(false);
  });

  it('mutes all playback when the master sound switch is off', () => {
    const profile = resolveSoundProfile({
      archetype: 'gentle',
      pacing: resolveEmotionalPacing({ phase: 'home' }),
      reduceMotion: false,
      soundEnabled: false,
      nightSoundEnabled: true,
      pushSoundEnabled: true,
    });
    expect(profile.allowUiClick).toBe(false);
    expect(profile.allowAmbientBed).toBe(false);
    expect(profile.playNotificationSound).toBe(false);
  });
});
