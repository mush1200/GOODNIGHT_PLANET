import type { AppPhase } from './emotionalPacing';
import { RITUAL_FINAL_QUIET_SECONDS } from './emotionalPacing';
import type { SoundProfile } from './soundProfile';

export type NightSoundscapePlaybackPlan = {
  loopAssetKey: string | null;
  loopVolume: number;
  oneShotAssetKey: string | null;
  oneShotVolume: number;
  silent: boolean;
};

export type SliceSoundInput = {
  slicePhase: string;
  ritualSecondsLeft?: number;
};

const LOOP_VOLUME = 0.18;
const HOME_AMBIENT_LOOP_VOLUME = 0.12;
const RITUAL_FINAL_LOOP_VOLUME = 0.07;
const ONE_SHOT_VOLUME = 0.16;

export function slicePhaseToAppPhase(input: SliceSoundInput): AppPhase | null {
  switch (input.slicePhase) {
    case 'home':
      return 'home';
    case 'ritual':
      return 'ritual';
    case 'sleeping':
      return 'sleeping';
    case 'unbox-reveal':
      return 'unboxing';
    default:
      return null;
  }
}

function silentPlan(): NightSoundscapePlaybackPlan {
  return {
    loopAssetKey: null,
    loopVolume: 0,
    oneShotAssetKey: null,
    oneShotVolume: 0,
    silent: true,
  };
}

export function resolveNightSoundscapePlayback(
  appPhase: AppPhase | null,
  profile: SoundProfile,
  ritualSecondsLeft?: number,
  nightSoundEnabled = true,
): NightSoundscapePlaybackPlan {
  if (!appPhase) {
    return silentPlan();
  }

  if (appPhase === 'sleeping') {
    return silentPlan();
  }

  if (appPhase === 'home') {
    if (!nightSoundEnabled || !profile.allowAmbientBed || !profile.ambientBedAssetKey) {
      return silentPlan();
    }
    return {
      loopAssetKey: profile.ambientBedAssetKey,
      loopVolume: HOME_AMBIENT_LOOP_VOLUME,
      oneShotAssetKey: null,
      oneShotVolume: 0,
      silent: false,
    };
  }

  if (appPhase === 'ritual') {
    if (!profile.allowBreathPulse) {
      return silentPlan();
    }
    const finalQuiet =
      typeof ritualSecondsLeft === 'number' &&
      ritualSecondsLeft > 0 &&
      ritualSecondsLeft <= RITUAL_FINAL_QUIET_SECONDS;
    return {
      loopAssetKey: profile.ritualBreathAssetKey,
      loopVolume: finalQuiet ? RITUAL_FINAL_LOOP_VOLUME : LOOP_VOLUME,
      oneShotAssetKey: null,
      oneShotVolume: 0,
      silent: false,
    };
  }

  if (appPhase === 'unboxing') {
    if (!nightSoundEnabled) {
      return silentPlan();
    }
    return {
      loopAssetKey: null,
      loopVolume: 0,
      oneShotAssetKey: profile.revealAssetKey,
      oneShotVolume: ONE_SHOT_VOLUME,
      silent: false,
    };
  }

  return silentPlan();
}
