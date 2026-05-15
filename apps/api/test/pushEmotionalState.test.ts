import { describe, expect, it } from 'vitest';

import {
  derivePushEmotionalState,
  normalizePushEmotionalState,
} from '../src/pushEmotionalState.js';

describe('pushEmotionalState (§5.7)', () => {
  it('prioritizes recovering over wilted and missed_you', () => {
    expect(
      derivePushEmotionalState({
        worldAttunement: 'recovering',
        daysSinceLastOpenLogical: 9,
        earlyBedForDream: true,
        streakDays: 10,
      }),
    ).toBe('recovering');
  });

  it('maps wilted when not recovering', () => {
    expect(
      derivePushEmotionalState({
        worldAttunement: 'wilted',
        daysSinceLastOpenLogical: 9,
        earlyBedForDream: false,
        streakDays: 0,
      }),
    ).toBe('wilted');
  });

  it('maps missed_you when days gap >= 2', () => {
    expect(
      derivePushEmotionalState({
        worldAttunement: 'steady',
        daysSinceLastOpenLogical: 2,
        earlyBedForDream: false,
        streakDays: 0,
      }),
    ).toBe('missed_you');
  });

  it('maps early_bed before steady companion', () => {
    expect(
      derivePushEmotionalState({
        worldAttunement: 'steady',
        daysSinceLastOpenLogical: 0,
        earlyBedForDream: true,
        streakDays: 5,
      }),
    ).toBe('early_bed');
  });

  it('maps steady_companion when streak >= 3', () => {
    expect(
      derivePushEmotionalState({
        worldAttunement: 'steady',
        daysSinceLastOpenLogical: 0,
        earlyBedForDream: false,
        streakDays: 3,
      }),
    ).toBe('steady_companion');
  });

  it('falls back unknown state to steady', () => {
    expect(normalizePushEmotionalState('unknown')).toBe('steady');
  });
});
