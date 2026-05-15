import type { NightSkyKey } from '../api/openapiTypes';

import { nightSkyThemeForKey } from './nightSkyTheme';

const SHELL_WASH = 'rgba(252, 211, 138, 0.042)';

const HERO_GLOW_ALPHA: Record<NightSkyKey, number> = {
  clear_star: 0.15,
  soft_rain: 0.13,
  blue_moon: 0.17,
};

function heroGlowForKey(key: NightSkyKey): string {
  const theme = nightSkyThemeForKey(key);
  const match = theme.glow.match(/rgba\((\d+),\s*(\d+),\s*(\d+),/);
  if (!match) return theme.glow;
  return `rgba(${match[1]}, ${match[2]}, ${match[3]}, ${HERO_GLOW_ALPHA[key]})`;
}

export function cottageWarmthForKey(nightSkyKey?: string) {
  const key = nightSkyKey && nightSkyKey in HERO_GLOW_ALPHA ? (nightSkyKey as NightSkyKey) : 'clear_star';
  return {
    shellWash: SHELL_WASH,
    heroGlow: heroGlowForKey(key),
  };
}
