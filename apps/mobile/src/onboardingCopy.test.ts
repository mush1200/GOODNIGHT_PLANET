import { describe, expect, it } from 'vitest';
import { onboardingBanner } from './onboardingCopy';

describe('onboarding phase copy (7.2.7)', () => {
  it('maps settled and legacy steady without exposing keys', () => {
    expect(onboardingBanner('settled')).toMatch(/習慣/);
    expect(onboardingBanner('steady')).toMatch(/習慣/);
    expect(onboardingBanner('first_night')).not.toMatch(/first_night/);
  });
});
