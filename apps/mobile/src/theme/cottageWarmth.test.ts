import { describe, expect, it } from 'vitest';

import { cottageWarmthForKey } from './cottageWarmth';

describe('cottageWarmth', () => {
  it('keeps the shell wash softer than the hero glow', () => {
    const warmth = cottageWarmthForKey('blue_moon');

    expect(warmth.shellWash).toBe('rgba(252, 211, 138, 0.042)');
    expect(warmth.heroGlow).toBe('rgba(147, 197, 253, 0.17)');
  });
});
