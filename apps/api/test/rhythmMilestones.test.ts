import { describe, expect, it } from 'vitest';
import { rollNightSky, tierFromGrowth } from '../src/balance.js';

/** §4.8 節奏：首晚夜空規則、成長階可隨 nights 遞增驗證 */
describe('rhythm milestones (4.3)', () => {
  it('night 1 sky is teaching clear_star', () => {
    expect(rollNightSky({ nightsCompleted: 0, random: () => 0.99 })).toBe('clear_star');
  });

  it('before day 7 uses weighted distribution (still only slice keys)', () => {
    const keys = new Set<string>();
    for (let i = 0; i < 200; i++) {
      keys.add(rollNightSky({ nightsCompleted: 3, random: Math.random }));
    }
    expect(keys.has('clear_star') || keys.has('soft_rain') || keys.has('blue_moon')).toBe(true);
    for (const k of keys) {
      expect(['clear_star', 'soft_rain', 'blue_moon']).toContain(k);
    }
  });

  it('growth tier advances with cumulative nights-style bumps', () => {
    expect(tierFromGrowth(0)).toBe(1);
    expect(tierFromGrowth(500)).toBeGreaterThanOrEqual(2);
    expect(tierFromGrowth(280)).toBe(4);
  });
});
