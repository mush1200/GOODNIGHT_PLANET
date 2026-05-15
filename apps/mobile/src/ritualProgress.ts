import type { TodayResponse } from './api/client';

export type RitualStepId = 'countdown' | 'sleep';

export type RitualStep = { id: RitualStepId; label: string; done: boolean };

export function ritualStepStates(
  today: Pick<TodayResponse, 'ritualCountdownCompleted' | 'sleepStarted'>,
): RitualStep[] {
  return [
    { id: 'countdown', label: '倒數靜心完成', done: today.ritualCountdownCompleted },
    { id: 'sleep', label: '已按下「我要睡了」', done: today.sleepStarted },
  ];
}

export function ritualProgressLines(today: Pick<TodayResponse, 'ritualCountdownCompleted' | 'sleepStarted'>) {
  const steps = ritualStepStates(today);
  const mark = (done: boolean) => (done ? '✓' : '○');
  return {
    countdownLine: `${mark(steps[0].done)} ${steps[0].label}`,
    sleepLine: `${mark(steps[1].done)} ${steps[1].label}`,
  };
}
