import type { TodayResponse } from './api/client';

export function tonightSkyGlanceLine(
  nightSky: Pick<TodayResponse['nightSky'], 'displayName'>,
): string {
  return `今晚：${nightSky.displayName}`;
}

export function ritualGlanceLine(
  today: Pick<
    TodayResponse,
    'ritualCountdownCompleted' | 'sleepStarted' | 'sleeping' | 'unboxed'
  >,
): string {
  if (today.unboxed) return '儀式：今晚已收進記憶裡';
  if (today.sleeping) return '儀式：正在夜裡慢慢歇著';
  if (today.sleepStarted) return '儀式：今晚的路先走到這裡';
  if (today.ritualCountdownCompleted) return '儀式：可以輕聲說晚安了';
  return '儀式：還差一步，把燈慢慢關上';
}
