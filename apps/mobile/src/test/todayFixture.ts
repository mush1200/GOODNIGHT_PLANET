import type { TodayResponse } from '../api/client';

export function makeToday(overrides: Partial<TodayResponse> = {}): TodayResponse {
  return {
    logicalSleepDate: '2026-05-12',
    nightSky: { key: 'blue_moon', displayName: '偏藍的月光' },
    forecastSummary: '雲層薄，適合拍一拍肩膀。',
    rarityNarrativeTag: '較少見的夜空',
    streakDays: 3,
    worldTier: 2,
    worldGrowthValue: 12,
    worldProgressFraction: 0.5,
    ritualCountdownCompleted: true,
    sleepStarted: false,
    sleeping: false,
    unboxed: false,
    goodnightLine: '今晚把疲倦放下。',
    petArchetype: 'gentle',
    ...overrides,
  };
}
