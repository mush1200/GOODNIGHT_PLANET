import type { PetArchetype } from '../api/openapiTypes';

export type AppPhase =
  | 'home'
  | 'ritual'
  | 'sleeping'
  | 'unboxing'
  | 'unbox-reveal'
  | 'memory'
  | 'world';

export type EmotionalIntensity = 0 | 1 | 2 | 3;

export type EmotionalPacingCue = {
  emotionalIntensity: EmotionalIntensity;
  copyBudget: 'one_line' | 'minimal' | 'silent' | 'none';
  motionLevel: 'ambient' | 'breath' | 'static' | 'minimal';
  allowUiClickSound: boolean;
  allowAmbientBed: boolean;
  allowBreathPulse: boolean;
};

export const RITUAL_FINAL_QUIET_SECONDS = 5;

export function ritualPacingPhase(ritualSecondsLeft: number): 'ritual_early' | 'ritual_final' {
  return ritualSecondsLeft > 0 && ritualSecondsLeft <= RITUAL_FINAL_QUIET_SECONDS
    ? 'ritual_final'
    : 'ritual_early';
}

export function resolveEmotionalPacing(args: {
  phase: AppPhase;
  ritualSecondsLeft?: number;
}): EmotionalPacingCue {
  if (args.phase === 'ritual') {
    const finalQuiet =
      typeof args.ritualSecondsLeft === 'number' &&
      args.ritualSecondsLeft > 0 &&
      args.ritualSecondsLeft <= RITUAL_FINAL_QUIET_SECONDS;
    if (finalQuiet) {
      return {
        emotionalIntensity: 0,
        copyBudget: 'silent',
        motionLevel: 'breath',
        allowUiClickSound: false,
        allowAmbientBed: false,
        allowBreathPulse: true,
      };
    }
    return {
      emotionalIntensity: 2,
      copyBudget: 'minimal',
      motionLevel: 'breath',
      allowUiClickSound: true,
      allowAmbientBed: false,
      allowBreathPulse: true,
    };
  }

  switch (args.phase) {
    case 'home':
      return {
        emotionalIntensity: 1,
        copyBudget: 'one_line',
        motionLevel: 'ambient',
        allowUiClickSound: true,
        allowAmbientBed: true,
        allowBreathPulse: false,
      };
    case 'sleeping':
      return {
        emotionalIntensity: 0,
        copyBudget: 'none',
        motionLevel: 'static',
        allowUiClickSound: false,
        allowAmbientBed: false,
        allowBreathPulse: false,
      };
    case 'unboxing':
    case 'unbox-reveal':
      return {
        emotionalIntensity: 1,
        copyBudget: 'minimal',
        motionLevel: 'minimal',
        allowUiClickSound: false,
        allowAmbientBed: false,
        allowBreathPulse: false,
      };
    case 'memory':
    case 'world':
      return {
        emotionalIntensity: 1,
        copyBudget: 'minimal',
        motionLevel: 'minimal',
        allowUiClickSound: true,
        allowAmbientBed: false,
        allowBreathPulse: false,
      };
    default:
      return {
        emotionalIntensity: 1,
        copyBudget: 'minimal',
        motionLevel: 'ambient',
        allowUiClickSound: true,
        allowAmbientBed: false,
        allowBreathPulse: false,
      };
  }
}

export function ritualHintCopy(secondsLeft: number): string {
  if (secondsLeft <= 0) return '可以按下「我要睡了」';
  if (secondsLeft <= RITUAL_FINAL_QUIET_SECONDS) return '';
  return `慢慢呼吸… ${Math.ceil(secondsLeft)}s`;
}

export function appPhaseFromSlicePhase(phase: string): AppPhase | null {
  switch (phase) {
    case 'home':
    case 'ritual':
    case 'sleeping':
    case 'unboxing':
    case 'unbox-reveal':
    case 'memory':
    case 'world':
      return phase;
    default:
      return null;
  }
}

export function archetypeMotionBias(archetype: PetArchetype): 'still' | 'breath' | 'float' {
  switch (archetype) {
    case 'sleepy':
      return 'still';
    case 'night_owl':
      return 'float';
    default:
      return 'breath';
  }
}
