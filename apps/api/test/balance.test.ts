import { describe, expect, it } from 'vitest';
import {
  DROP_WEIGHTS,
  progressInTier,
  rarityNarrativeTag,
  rollDream,
  rollNightSky,
  tierFromGrowth,
} from '../src/balance.js';

describe('tierFromGrowth', () => {
  it('maps thresholds to tiers 1–4', () => {
    expect(tierFromGrowth(0)).toBe(1);
    expect(tierFromGrowth(39)).toBe(1);
    expect(tierFromGrowth(40)).toBe(2);
    expect(tierFromGrowth(119)).toBe(2);
    expect(tierFromGrowth(120)).toBe(3);
    expect(tierFromGrowth(279)).toBe(3);
    expect(tierFromGrowth(280)).toBe(4);
    expect(tierFromGrowth(9999)).toBe(4);
  });
});

describe('progressInTier', () => {
  it('interpolates within tier span and caps at 1 for tier 4', () => {
    expect(progressInTier(0, 1)).toBe(0);
    expect(progressInTier(20, 1)).toBe(0.5);
    expect(progressInTier(40, 2)).toBe(0);
    expect(progressInTier(280, 4)).toBe(1);
  });
});

describe('rollNightSky', () => {
  it('first night is always clear_star', () => {
    expect(rollNightSky({ nightsCompleted: 0, random: () => 0.99 })).toBe('clear_star');
  });

  it('respects early-game band thresholds', () => {
    expect(rollNightSky({ nightsCompleted: 1, random: () => 0 })).toBe('clear_star');
    expect(rollNightSky({ nightsCompleted: 1, random: () => 0.55 })).toBe('soft_rain');
    expect(rollNightSky({ nightsCompleted: 1, random: () => 0.9 })).toBe('blue_moon');
  });

  it('uses late-game thirds', () => {
    expect(rollNightSky({ nightsCompleted: 10, random: () => 0 })).toBe('clear_star');
    expect(rollNightSky({ nightsCompleted: 10, random: () => 0.34 })).toBe('soft_rain');
    expect(rollNightSky({ nightsCompleted: 10, random: () => 0.67 })).toBe('blue_moon');
  });
});

describe('rollDream', () => {
  it('returns a key from the night table', () => {
    const keys = Object.keys(DROP_WEIGHTS.clear_star);
    expect(keys).toContain(rollDream('clear_star', () => 0));
    expect(keys).toContain(rollDream('clear_star', () => 0.999));
  });

  it('deterministic at weight boundaries for clear_star', () => {
    const t = DROP_WEIGHTS.clear_star;
    const total =
      t.rain_city + t.star_path + t.train_whisper + t.lake_mirror + t.aurora_hint;
    expect(total).toBe(1);
    const pRain = t.rain_city / total;
    expect(rollDream('clear_star', () => pRain - 1e-12)).toBe('rain_city');
    expect(rollDream('clear_star', () => pRain + 1e-12)).toBe('star_path');
  });
});

describe('DROP_WEIGHTS (Vertical Slice: 5 dreams × 3 skies)', () => {
  const dreamKeys = ['rain_city', 'star_path', 'train_whisper', 'lake_mirror', 'aurora_hint'] as const;

  it('each night sky has exactly five dream keys and weights sum to 1', () => {
    for (const sky of ['clear_star', 'soft_rain', 'blue_moon'] as const) {
      const row = DROP_WEIGHTS[sky];
      const keys = Object.keys(row).sort();
      expect(keys).toEqual([...dreamKeys].sort());
      const sum = dreamKeys.reduce((acc, k) => acc + row[k], 0);
      expect(sum).toBeCloseTo(1, 10);
    }
  });
});

describe('rarityNarrativeTag', () => {
  const ipUnsafe = /SSR|UR|NO\.\s*\d+|圖鑑/i;

  it('maps known rarities', () => {
    expect(rarityNarrativeTag('common')).toContain('熟悉');
    expect(rarityNarrativeTag('uncommon')).toContain('較少見');
    expect(rarityNarrativeTag('rare')).toContain('較少見');
  });

  it('never exposes gacha-style tier tokens (§八)', () => {
    for (const r of ['common', 'uncommon', 'rare', 'legendary', 'ssr']) {
      expect(rarityNarrativeTag(r)).not.toMatch(ipUnsafe);
    }
  });

  it('falls back for unknown', () => {
    expect(rarityNarrativeTag('legendary')).toBe('今晚夜空');
  });
});
