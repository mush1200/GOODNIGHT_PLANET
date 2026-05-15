import type { OnboardingPhase } from './api/openapiTypes';

const COPY: Record<OnboardingPhase, string> = {
  first_night: '第一晚：慢慢認識小屋也沒關係。',
  first_week: '首週：我們把節奏走穩就好。',
  settled: '一起把夜晚過成習慣。',
};

export function onboardingBanner(phase: string | undefined): string | null {
  if (!phase) return null;
  if (phase === 'steady') return COPY.settled;
  if (phase in COPY) return COPY[phase as OnboardingPhase];
  return null;
}
