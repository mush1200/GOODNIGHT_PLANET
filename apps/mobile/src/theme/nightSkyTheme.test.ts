import { describe, expect, it } from 'vitest';
import { NIGHT_SKY_THEMES, nightSkyThemeForKey } from './nightSkyTheme';

describe('night sky backgrounds (7.1.1)', () => {
  it('maps all three nightSky keys to distinct themes', () => {
    expect(Object.keys(NIGHT_SKY_THEMES).sort()).toEqual(['blue_moon', 'clear_star', 'soft_rain']);
    expect(nightSkyThemeForKey('clear_star').assetId).toBe('bg_clear_star');
    expect(nightSkyThemeForKey('soft_rain').assetId).toBe('bg_soft_rain');
    expect(nightSkyThemeForKey('blue_moon').assetId).toBe('bg_blue_moon');
    expect(nightSkyThemeForKey('blue_moon').petOverlay.window).toBe('rgba(147,197,253,0.2)');
  });
});
