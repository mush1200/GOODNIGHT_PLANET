import type { TodayResponse } from './api/client';

export type PetPose = 'holding_pillow' | 'dozing' | 'by_window' | 'kept_lamp' | 'dim_breath';

export type PetOverlay = 'none' | 'pillow' | 'window_glow' | 'lamp_warm' | 'dim_veil';

export type PetAnimationPreset = 'still' | 'breathing' | 'slow_float' | 'tiny_rotation';

export type PetMicroPerformance = {
  pose: PetPose;
  overlay: PetOverlay;
  animationPreset: PetAnimationPreset;
};

type TodayPerformance = Pick<
  TodayResponse,
  | 'sleeping'
  | 'unboxed'
  | 'ritualCountdownCompleted'
  | 'sleepStarted'
  | 'nightSky'
  | 'streakDays'
  | 'worldAttunement'
>;

const POSE_PRESETS: Record<
  PetPose,
  Pick<PetMicroPerformance, 'overlay' | 'animationPreset'>
> = {
  holding_pillow: { overlay: 'pillow', animationPreset: 'tiny_rotation' },
  dozing: { overlay: 'none', animationPreset: 'breathing' },
  by_window: { overlay: 'window_glow', animationPreset: 'slow_float' },
  kept_lamp: { overlay: 'lamp_warm', animationPreset: 'breathing' },
  dim_breath: { overlay: 'dim_veil', animationPreset: 'breathing' },
};

function ritualIncomplete(today: TodayPerformance): boolean {
  return !today.sleeping && !today.unboxed && (!today.ritualCountdownCompleted || !today.sleepStarted);
}

export function derivePetMicroPerformance(today: TodayPerformance): PetMicroPerformance {
  let pose: PetPose = 'holding_pillow';

  if (today.sleeping) {
    pose = 'dozing';
  } else if (today.worldAttunement === 'wilted') {
    pose = 'dim_breath';
  } else if (today.nightSky.key === 'blue_moon') {
    pose = 'by_window';
  } else if (today.streakDays >= 3) {
    pose = 'kept_lamp';
  } else if (ritualIncomplete(today)) {
    pose = 'holding_pillow';
  }

  return { pose, ...POSE_PRESETS[pose] };
}
