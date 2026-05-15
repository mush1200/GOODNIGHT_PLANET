import type { WorldAttunement } from '../api/openapiTypes';
import { colors } from './tokens';

export type AttunementVisual = {
  background: string;
  cardBorder: string;
  accent: string;
  saturation: number;
};

const BASE: AttunementVisual = {
  background: colors.nightDeep,
  cardBorder: colors.surfaceCardBorder,
  accent: colors.accentSoft,
  saturation: 1,
};

export function attunementVisual(state: WorldAttunement | undefined): AttunementVisual {
  switch (state) {
    case 'wilted':
      return {
        background: '#15121c',
        cardBorder: 'rgba(255,255,255,0.08)',
        accent: '#a89cc8',
        saturation: 0.72,
      };
    case 'recovering':
      return {
        background: '#1a1628',
        cardBorder: 'rgba(196,181,253,0.22)',
        accent: colors.accentWarm,
        saturation: 0.92,
      };
  }
  return BASE;
}
