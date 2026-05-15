import { describe, expect, it } from 'vitest';
import { NIGHT_SKY_ASSET_SCENES, nightSkyAssetSceneForKey } from './nightSkyAssets';

describe('night sky asset scenes (8.1.1)', () => {
  it('maps each nightSky key to a scene asset id', () => {
    for (const key of ['clear_star', 'soft_rain', 'blue_moon'] as const) {
      const scene = nightSkyAssetSceneForKey(key);
      expect(scene.assetId).toBe(NIGHT_SKY_ASSET_SCENES[key].assetId);
      expect(scene.assetId).not.toBe('TBD');
      expect(scene.layers.length).toBeGreaterThan(0);
    }
  });
});
