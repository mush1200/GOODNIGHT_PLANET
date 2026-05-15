import { describe, expect, it } from 'vitest';
import { EARLY_BED_AURORA_MULTIPLIER, rollDream } from '../src/balance.js';

describe('early bed dream weights (2.8.4)', () => {
  it('multiplier matches game_balance_tables §4', () => {
    expect(EARLY_BED_AURORA_MULTIPLIER).toBe(1.5);
  });

  it('increases aurora_hint frequency vs baseline (Monte Carlo)', () => {
    const rng = (seed: number) => {
      let s = seed;
      return () => {
        s = (s * 1103515245 + 12345) >>> 0;
        return s / 4294967296;
      };
    };
    let baseAurora = 0;
    let earlyAurora = 0;
    const n = 3000;
    for (let i = 0; i < n; i++) {
      if (rollDream('blue_moon', rng(i)) === 'aurora_hint') baseAurora += 1;
      if (rollDream('blue_moon', rng(i + 10_000), { earlyBed: true }) === 'aurora_hint') earlyAurora += 1;
    }
    expect(earlyAurora).toBeGreaterThan(baseAurora);
  });
});
