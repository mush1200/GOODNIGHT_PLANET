import type { NightSkyKey } from '../api/openapiTypes';

export type NightSkySceneLayer = 'stars' | 'rain' | 'moon' | 'horizon';

export type NightSkyAssetScene = {
  assetId: string;
  layers: readonly NightSkySceneLayer[];
};

export const NIGHT_SKY_ASSET_SCENES: Record<NightSkyKey, NightSkyAssetScene> = {
  clear_star: { assetId: 'bg_clear_star', layers: ['stars', 'horizon'] },
  soft_rain: { assetId: 'bg_soft_rain', layers: ['rain', 'horizon'] },
  blue_moon: { assetId: 'bg_blue_moon', layers: ['moon', 'stars', 'horizon'] },
};

export function nightSkyAssetSceneForKey(key: string): NightSkyAssetScene {
  if (key in NIGHT_SKY_ASSET_SCENES) return NIGHT_SKY_ASSET_SCENES[key as NightSkyKey];
  return NIGHT_SKY_ASSET_SCENES.clear_star;
}
