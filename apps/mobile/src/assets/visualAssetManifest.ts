import type { NightSkyKey, PetArchetype } from '../api/openapiTypes';

export type VisualAssetKind = 'night_sky' | 'pet_portrait' | 'dream_illustration';

export type VisualAssetEntry = {
  kind: VisualAssetKind;
  key: string;
  assetId: string;
  delivery: 'scene_layer' | 'vector_scene' | 'illustration_slot';
  externalUri: string | null;
};

const NIGHT_SKY_KEYS: NightSkyKey[] = ['clear_star', 'soft_rain', 'blue_moon'];
const PET_ARCHETYPES: PetArchetype[] = ['gentle', 'sleepy', 'shy', 'night_owl'];
const DREAM_KEYS = ['rain_city', 'star_path', 'train_whisper', 'lake_mirror', 'aurora_hint'] as const;

export const VISUAL_ASSET_MANIFEST: readonly VisualAssetEntry[] = [
  ...NIGHT_SKY_KEYS.map((key) => ({
    kind: 'night_sky' as const,
    key,
    assetId: key === 'clear_star' ? 'bg_clear_star' : key === 'soft_rain' ? 'bg_soft_rain' : 'bg_blue_moon',
    delivery: 'scene_layer' as const,
    externalUri: null,
  })),
  ...PET_ARCHETYPES.map((key) => ({
    kind: 'pet_portrait' as const,
    key,
    assetId: `pet_${key}`,
    delivery: 'vector_scene' as const,
    externalUri: null,
  })),
  ...DREAM_KEYS.map((key) => ({
    kind: 'dream_illustration' as const,
    key,
    assetId: `dream_${key}`,
    delivery: 'illustration_slot' as const,
    externalUri: null,
  })),
];

export function visualAssetFor(kind: VisualAssetKind, key: string): VisualAssetEntry | null {
  return VISUAL_ASSET_MANIFEST.find((entry) => entry.kind === kind && entry.key === key) ?? null;
}
