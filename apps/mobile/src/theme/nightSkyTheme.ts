import type { NightSkyKey } from '../api/openapiTypes';

export type NightSkyPetOverlay = {
  pillow: string;
  window: string;
  windowBorder: string;
  lamp: string;
  dim: string;
};

export type NightSkyTheme = {
  top: string;
  bottom: string;
  glow: string;
  assetId: string;
  petOverlay: NightSkyPetOverlay;
};

export const NIGHT_SKY_THEMES: Record<NightSkyKey, NightSkyTheme> = {
  clear_star: {
    top: '#1a1428',
    bottom: '#2d3a5c',
    glow: 'rgba(196,181,253,0.18)',
    assetId: 'bg_clear_star',
    petOverlay: {
      pillow: 'rgba(196,181,253,0.35)',
      window: 'rgba(196,181,253,0.18)',
      windowBorder: 'rgba(196,181,253,0.28)',
      lamp: 'rgba(252,211,138,0.2)',
      dim: 'rgba(26,20,40,0.22)',
    },
  },
  soft_rain: {
    top: '#141a24',
    bottom: '#243040',
    glow: 'rgba(148,163,184,0.16)',
    assetId: 'bg_soft_rain',
    petOverlay: {
      pillow: 'rgba(148,163,184,0.32)',
      window: 'rgba(148,163,184,0.16)',
      windowBorder: 'rgba(148,163,184,0.26)',
      lamp: 'rgba(148,163,184,0.18)',
      dim: 'rgba(20,26,36,0.24)',
    },
  },
  blue_moon: {
    top: '#121a2e',
    bottom: '#1e2f4a',
    glow: 'rgba(147,197,253,0.2)',
    assetId: 'bg_blue_moon',
    petOverlay: {
      pillow: 'rgba(147,197,253,0.34)',
      window: 'rgba(147,197,253,0.2)',
      windowBorder: 'rgba(147,197,253,0.3)',
      lamp: 'rgba(147,197,253,0.18)',
      dim: 'rgba(18,26,46,0.22)',
    },
  },
};

export function nightSkyThemeForKey(key: string): NightSkyTheme {
  if (key in NIGHT_SKY_THEMES) return NIGHT_SKY_THEMES[key as NightSkyKey];
  return NIGHT_SKY_THEMES.clear_star;
}
