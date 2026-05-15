import { describe, expect, it } from 'vitest';

import { derivePushEmotionalState } from './pushEmotionalState';

describe('pushEmotionalState (mobile parity)', () => {
  it('matches API priority for recovering', () => {
    expect(
      derivePushEmotionalState({
        worldAttunement: 'recovering',
        daysSinceLastOpenLogical: 4,
        earlyBedForDream: true,
        streakDays: 4,
      }),
    ).toBe('recovering');
  });
});
