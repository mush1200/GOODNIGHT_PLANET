import type { WorldAttunementKind } from './worldAttunement.js';

export const PUSH_EMOTIONAL_STATES = [
  'recovering',
  'wilted',
  'missed_you',
  'early_bed',
  'steady_companion',
  'steady',
] as const;

export type PushEmotionalState = (typeof PUSH_EMOTIONAL_STATES)[number];

export type PushToneContext = {
  worldAttunement: WorldAttunementKind;
  daysSinceLastOpenLogical: number;
  earlyBedForDream: boolean;
  streakDays: number;
};

export function normalizePushEmotionalState(raw: string | null | undefined): PushEmotionalState {
  if (raw && (PUSH_EMOTIONAL_STATES as readonly string[]).includes(raw)) {
    return raw as PushEmotionalState;
  }
  return 'steady';
}

/** 與 `pickContextualLine` 優先序對齊（不含 first_night／home_dock／fallback）。 */
export function derivePushEmotionalState(ctx: PushToneContext): PushEmotionalState {
  if (ctx.worldAttunement === 'recovering') return 'recovering';
  if (ctx.worldAttunement === 'wilted') return 'wilted';
  if (ctx.daysSinceLastOpenLogical >= 2) return 'missed_you';
  if (ctx.earlyBedForDream) return 'early_bed';
  if (ctx.streakDays >= 3) return 'steady_companion';
  return 'steady';
}
