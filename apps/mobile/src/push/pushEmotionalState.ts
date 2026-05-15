import type { TodayResponse } from '../api/client';

export const PUSH_EMOTIONAL_STATES = [
  'recovering',
  'wilted',
  'missed_you',
  'early_bed',
  'steady_companion',
  'steady',
] as const;

export type PushEmotionalState = (typeof PUSH_EMOTIONAL_STATES)[number];

export type PushToneContext = Pick<
  TodayResponse,
  'worldAttunement' | 'daysSinceLastOpenLogical' | 'earlyBedForDream' | 'streakDays'
>;

export function derivePushEmotionalState(ctx: PushToneContext): PushEmotionalState {
  if (ctx.worldAttunement === 'recovering') return 'recovering';
  if (ctx.worldAttunement === 'wilted') return 'wilted';
  if ((ctx.daysSinceLastOpenLogical ?? 0) >= 2) return 'missed_you';
  if (ctx.earlyBedForDream === true) return 'early_bed';
  if (ctx.streakDays >= 3) return 'steady_companion';
  return 'steady';
}
