/** §5.16～5.19 新手期 — 不增新系統，僅階段標籤供 UI／節奏 */
export type OnboardingPhase = 'first_night' | 'first_week' | 'settled';

export function onboardingPhase(
  nightsCompleted: number,
  unboxedTonight: boolean,
): OnboardingPhase {
  if (nightsCompleted === 0 && !unboxedTonight) return 'first_night';
  if (nightsCompleted < 7) return 'first_week';
  return 'settled';
}
