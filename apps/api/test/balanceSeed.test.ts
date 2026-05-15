import { describe, expect, it } from 'vitest';
import {
  DROP_WEIGHTS,
  NIGHT_SKY_BG_ASSET_SSOT,
  NIGHT_SKY_DEFINITION_SSOT,
  type NightSkyKey,
} from '../src/balance.js';

describe('night_sky SSOT vs balance keys (checklist 2.3.1 / 3.2)', () => {
  it('SSOT lists exactly the three vertical-slice keys with forecast copy aligned to game_balance_tables.md §2', () => {
    const keys = NIGHT_SKY_DEFINITION_SSOT.map((r) => r.key);
    expect(keys.sort()).toEqual(['blue_moon', 'clear_star', 'soft_rain'].sort());

    const byKey = Object.fromEntries(NIGHT_SKY_DEFINITION_SSOT.map((r) => [r.key, r])) as Record<
      NightSkyKey,
      (typeof NIGHT_SKY_DEFINITION_SSOT)[number]
    >;

    expect(byKey.clear_star.forecast_summary).toBe('今晚星星很靠近');
    expect(byKey.soft_rain.forecast_summary).toBe('雲層把腳步放輕了');
    expect(byKey.blue_moon.forecast_summary).toBe('月亮今晚偏藍一點');
    for (const row of NIGHT_SKY_DEFINITION_SSOT) {
      expect(NIGHT_SKY_BG_ASSET_SSOT[row.key]).toMatch(/^bg_/);
      expect(NIGHT_SKY_BG_ASSET_SSOT[row.key]).not.toBe('TBD');
    }
  });

  it('DROP_WEIGHTS has one column per night_sky SSOT key', () => {
    for (const row of NIGHT_SKY_DEFINITION_SSOT) {
      expect(DROP_WEIGHTS[row.key]).toBeDefined();
    }
    expect(Object.keys(DROP_WEIGHTS).sort()).toEqual(
      NIGHT_SKY_DEFINITION_SSOT.map((r) => r.key).sort(),
    );
  });
});
