import type { PetArchetype } from './api/openapiTypes';
import type { EmotionalPacingCue } from './emotionalPacing';

export type SoundMaterialKey =
  | 'wood_lamp'
  | 'cotton_muffled'
  | 'doorstep_quiet'
  | 'window_air';

export type SoundProfile = {
  materialKey: SoundMaterialKey;
  uiConfirmAssetKey: string;
  ritualBreathAssetKey: string;
  ambientBedAssetKey: string | null;
  revealAssetKey: string;
  transitionAssetKey: string;
  notificationSoundKey: 'push_goodnight_whisper' | 'silent';
  breathCycleMs: number;
  allowAmbientBed: boolean;
  allowUiClick: boolean;
  allowBreathPulse: boolean;
  playNotificationSound: boolean;
};

function materialForArchetype(archetype: PetArchetype): SoundMaterialKey {
  switch (archetype) {
    case 'sleepy':
      return 'cotton_muffled';
    case 'shy':
      return 'doorstep_quiet';
    case 'night_owl':
      return 'window_air';
    default:
      return 'wood_lamp';
  }
}

export function resolveSoundProfile(args: {
  archetype: PetArchetype;
  pacing: EmotionalPacingCue;
  reduceMotion: boolean;
  soundEnabled: boolean;
  nightSoundEnabled: boolean;
  pushSoundEnabled: boolean;
}): SoundProfile {
  const materialKey = materialForArchetype(args.archetype);
  const nightSoundsOn = args.soundEnabled && args.nightSoundEnabled;
  const allowBreathPulse = args.pacing.allowBreathPulse && !args.reduceMotion && nightSoundsOn;
  const allowAmbientBed = args.pacing.allowAmbientBed && nightSoundsOn;
  const allowUiClick = args.pacing.allowUiClickSound && args.soundEnabled;

  return {
    materialKey,
    uiConfirmAssetKey: `ui_confirm_${args.archetype}`,
    ritualBreathAssetKey: `ritual_breath_${args.archetype}`,
    ambientBedAssetKey: allowAmbientBed ? `bed_home_${args.archetype}` : null,
    revealAssetKey: 'reveal_unbox',
    transitionAssetKey: 'transition_soft',
    notificationSoundKey:
      args.pushSoundEnabled && nightSoundsOn ? 'push_goodnight_whisper' : 'silent',
    breathCycleMs: 2200,
    allowAmbientBed,
    allowUiClick,
    allowBreathPulse,
    playNotificationSound: args.pushSoundEnabled && nightSoundsOn,
  };
}
