/** Contract-aligned enums — keep in sync with contracts/openapi.yaml */

export type NightSkyKey = 'clear_star' | 'soft_rain' | 'blue_moon';
export type DreamKey =
  | 'rain_city'
  | 'star_path'
  | 'train_whisper'
  | 'lake_mirror'
  | 'aurora_hint';
export type PetArchetype = 'gentle' | 'sleepy' | 'shy' | 'night_owl';
export type WorldAttunement = 'steady' | 'wilted' | 'recovering';
export type OnboardingPhase = 'first_night' | 'first_week' | 'settled';

export const OPENAPI_TODAY_REQUIRED_KEYS = [
  'logicalSleepDate',
  'nightSky',
  'forecastSummary',
  'rarityNarrativeTag',
  'streakDays',
  'nightsCompleted',
  'worldTier',
  'worldGrowthValue',
  'worldProgressFraction',
  'worldAttunement',
  'daysSinceLastOpenLogical',
  'attunementHint',
  'homeDockHint',
  'onboardingPhase',
  'moonGuardIsoWeek',
  'moonGuardUsesThisWeek',
  'moonGuardCanUse',
  'pushReminderEnabled',
  'ritualCountdownCompleted',
  'sleepStarted',
  'sleeping',
  'unboxed',
  'dayClosureCompleted',
  'dayClosureSkipped',
  'goodnightLine',
  'petArchetype',
  'stardustBalance',
  'earlyBedForDream',
] as const;
