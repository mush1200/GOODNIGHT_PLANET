import { describe, expect, it } from 'vitest';
import { isValidLocalHm, targetSleepDurationMinutes } from '../src/sleepSchedule.js';

describe('sleepSchedule (2.9.1)', () => {
  it('validates HH:mm', () => {
    expect(isValidLocalHm('22:30')).toBe(true);
    expect(isValidLocalHm('24:00')).toBe(false);
    expect(isValidLocalHm('9:30')).toBe(false);
  });

  it('computes overnight span', () => {
    expect(targetSleepDurationMinutes('22:30', '07:00')).toBe(510);
    expect(targetSleepDurationMinutes('23:00', '23:30')).toBe(30);
  });
});
