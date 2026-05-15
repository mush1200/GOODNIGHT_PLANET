/**
 * Design tokens — align with docs/03_MOODBOARD.md & art_direction.md
 * SSOT for mobile styling in Vertical Slice.
 */

export const colors = {
  nightDeep: '#1a1428',
  nightMid: '#241f38',
  nightGlow: '#3d4a6b',
  surfaceCard: 'rgba(255,255,255,0.08)',
  surfaceCardBorder: 'rgba(255,255,255,0.12)',
  textPrimary: '#f5f0ff',
  textMuted: 'rgba(245,240,255,0.62)',
  accentSoft: '#c4b5fd',
  accentWarm: '#fcd38a',
  successSoft: '#86efac',
  stateAttuneLow: '#2a2439',
} as const;

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
} as const;

export const typography = {
  title: { fontSize: 22, fontWeight: '600' as const, letterSpacing: 0.3 },
  subtitle: { fontSize: 16, fontWeight: '500' as const },
  body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
  caption: { fontSize: 13, fontWeight: '400' as const, opacity: 0.85 },
  timer: { fontSize: 44, fontWeight: '300' as const, letterSpacing: 2 },
} as const;
