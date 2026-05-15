import { describe, expect, it } from 'vitest';

import { pickPostRitualDreamLine } from './postRitualDreamLine';

describe('pickPostRitualDreamLine', () => {
  it('returns a deterministic line for the same logical date', () => {
    const first = pickPostRitualDreamLine({
      logicalSleepDate: '2026-05-15',
      petArchetype: 'gentle',
    });
    const second = pickPostRitualDreamLine({
      logicalSleepDate: '2026-05-15',
      petArchetype: 'gentle',
    });
    expect(first).toMatch(/今晚|夢|雲/);
    expect(second).toBe(first);
  });

  it('uses archetype-specific pools', () => {
    const nightOwl = pickPostRitualDreamLine({
      logicalSleepDate: '2026-05-15',
      petArchetype: 'night_owl',
    });
    expect(nightOwl).toMatch(/夜|夢/);
  });
});
