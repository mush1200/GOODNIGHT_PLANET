import { describe, expect, it } from 'vitest';
import { onboardingPhase } from '../src/onboarding.js';

describe('onboardingPhase (2.8.2)', () => {
  it('first night before any completed night and not yet unboxed', () => {
    expect(onboardingPhase(0, false)).toBe('first_night');
  });
  it('first night ends after first unbox same evening', () => {
    expect(onboardingPhase(0, true)).toBe('first_week');
  });
  it('first week until 7 nights', () => {
    expect(onboardingPhase(1, false)).toBe('first_week');
    expect(onboardingPhase(6, false)).toBe('first_week');
    expect(onboardingPhase(7, false)).toBe('settled');
  });
});
