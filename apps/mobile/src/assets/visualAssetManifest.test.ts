import { describe, expect, it } from 'vitest';

import { NIGHT_SKY_ASSET_SCENES } from '../theme/nightSkyAssets';
import { VISUAL_ASSET_MANIFEST, visualAssetFor } from './visualAssetManifest';

describe('visual asset manifest (12.3.1)', () => {
  it('lists launch-priority night sky, pet, and dream illustration slots', () => {
    expect(VISUAL_ASSET_MANIFEST.filter((entry) => entry.kind === 'night_sky')).toHaveLength(3);
    expect(VISUAL_ASSET_MANIFEST.filter((entry) => entry.kind === 'pet_portrait')).toHaveLength(4);
    expect(VISUAL_ASSET_MANIFEST.filter((entry) => entry.kind === 'dream_illustration')).toHaveLength(5);
    for (const key of Object.keys(NIGHT_SKY_ASSET_SCENES)) {
      const entry = visualAssetFor('night_sky', key);
      expect(entry?.assetId).toBe(NIGHT_SKY_ASSET_SCENES[key as keyof typeof NIGHT_SKY_ASSET_SCENES].assetId);
    }
  });
});
