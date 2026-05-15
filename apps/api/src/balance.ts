/**
 * Coupled rules — mirror docs/game_balance_tables.md (do not drift).
 */

export type NightSkyKey = 'clear_star' | 'soft_rain' | 'blue_moon';

export type DreamKey = 'rain_city' | 'star_path' | 'train_whisper' | 'lake_mirror' | 'aurora_hint';

/** Mirrors docs/game_balance_tables.md §2 and migrations/002_seed_balance.sql — keep in sync. */
export const NIGHT_SKY_DEFINITION_SSOT: ReadonlyArray<{
  key: NightSkyKey;
  display_name: string;
  rarity: string;
  forecast_summary: string;
}> = [
  { key: 'clear_star', display_name: '星光清楚', rarity: 'common', forecast_summary: '今晚星星很靠近' },
  { key: 'soft_rain', display_name: '細雨綿綿', rarity: 'uncommon', forecast_summary: '雲層把腳步放輕了' },
  { key: 'blue_moon', display_name: '偏藍月光', rarity: 'rare', forecast_summary: '月亮今晚偏藍一點' },
];

export const NIGHT_SKY_BG_ASSET_SSOT: Record<NightSkyKey, string> = {
  clear_star: 'bg_clear_star',
  soft_rain: 'bg_soft_rain',
  blue_moon: 'bg_blue_moon',
};

/** Drop weights by night sky × dream (§4 drops). */
export const DROP_WEIGHTS: Record<NightSkyKey, Record<DreamKey, number>> = {
  clear_star: {
    rain_city: 0.2,
    star_path: 0.5,
    train_whisper: 0.2,
    lake_mirror: 0.05,
    aurora_hint: 0.05,
  },
  soft_rain: {
    rain_city: 0.5,
    star_path: 0.2,
    train_whisper: 0.2,
    lake_mirror: 0.08,
    aurora_hint: 0.02,
  },
  blue_moon: {
    rain_city: 0.1,
    star_path: 0.3,
    train_whisper: 0.2,
    lake_mirror: 0.25,
    aurora_hint: 0.15,
  },
};

export const DREAM_COPY: Record<
  DreamKey,
  { name: string; memoryLine: (ctx: { nightLabel: string }) => string }
> = {
  rain_city: {
    name: '雨天夢',
    memoryLine: () => '今晚記住了：街燈在雨裡變得很柔。',
  },
  star_path: {
    name: '星光夢',
    memoryLine: () => '今晚記住了：腳下有一條細細的星光小路。',
  },
  train_whisper: {
    name: '列車囈語',
    memoryLine: () => '今晚記住了：遠方列車的聲音像呼吸。',
  },
  lake_mirror: {
    name: '湖光夢',
    memoryLine: ({ nightLabel }) => `今晚記住了：${nightLabel}落在湖面，碎成小小的光。`,
  },
  aurora_hint: {
    name: '極光預感',
    memoryLine: () => '今晚記住了：天邊有一抹悄悄翻身的顏色。',
  },
};

/** MVP tier thresholds — placeholder until PD fills game_balance_tables §5. */
export const TIER_THRESHOLDS = [0, 40, 120, 280] as const;

export function tierFromGrowth(growth: number): number {
  let tier = 1;
  for (let i = TIER_THRESHOLDS.length - 1; i >= 0; i--) {
    if (growth >= TIER_THRESHOLDS[i]) {
      tier = i + 1;
      break;
    }
  }
  return Math.min(4, Math.max(1, tier));
}

export function progressInTier(growth: number, tier: number): number {
  if (tier >= 4) return 1;
  const low = TIER_THRESHOLDS[tier - 1] ?? 0;
  const high = TIER_THRESHOLDS[tier];
  const span = high - low;
  if (span <= 0) return 1;
  return Math.min(1, Math.max(0, (growth - low) / span));
}

export function rollNightSky(params: {
  nightsCompleted: number;
  random: () => number;
}): NightSkyKey {
  const { nightsCompleted, random } = params;
  if (nightsCompleted === 0) return 'clear_star';
  const r = random();
  if (nightsCompleted < 7) {
    if (r < 0.55) return 'clear_star';
    if (r < 0.9) return 'soft_rain';
    return 'blue_moon';
  }
  if (r < 0.33) return 'clear_star';
  if (r < 0.66) return 'soft_rain';
  return 'blue_moon';
}

/** game_balance_tables.md §4 — 早睡限定倍率（不得依賴季節池） */
export const EARLY_BED_AURORA_MULTIPLIER = 1.5;

export function rollDream(
  night: NightSkyKey,
  random: () => number,
  options?: { earlyBed?: boolean },
): DreamKey {
  const base = DROP_WEIGHTS[night];
  const w: Record<DreamKey, number> = { ...base };
  if (options?.earlyBed) {
    w.aurora_hint = base.aurora_hint * EARLY_BED_AURORA_MULTIPLIER;
  }
  const keys = Object.keys(w) as DreamKey[];
  let total = 0;
  const cum: { key: DreamKey; cut: number }[] = [];
  for (const key of keys) {
    total += w[key];
    cum.push({ key, cut: total });
  }
  const x = random() * total;
  for (const { key, cut } of cum) {
    if (x <= cut) return key;
  }
  return keys[keys.length - 1];
}

export function rarityNarrativeTag(rarity: string): string {
  switch (rarity) {
    case 'common':
      return '今晚夜空：溫柔而熟悉';
    case 'uncommon':
      return '今晚雲層把腳步放輕了（較少見）';
    case 'rare':
      return '今晚月亮偏藍一點（較少見）';
    default:
      return '今晚夜空';
  }
}
