import type { PetArchetype } from './api/openapiTypes';
import { resolveEmotionalPacing } from './emotionalPacing';
import { resolveSoundProfile } from './soundProfile';
import type { SoundProfile } from './soundProfile';

export function buildPushSoundProfile(args: {
  archetype: PetArchetype;
  reducedMotion: boolean;
  soundEnabled: boolean;
  nightSoundEnabled: boolean;
  pushReminderEnabled: boolean;
}): SoundProfile {
  const pacing = resolveEmotionalPacing({ phase: 'home' });
  return resolveSoundProfile({
    archetype: args.archetype,
    pacing,
    reduceMotion: args.reducedMotion,
    soundEnabled: args.soundEnabled,
    nightSoundEnabled: args.nightSoundEnabled,
    pushSoundEnabled: args.pushReminderEnabled,
  });
}
