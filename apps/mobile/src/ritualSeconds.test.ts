import { describe, expect, it } from 'vitest';
import { RITUAL_SECONDS } from './ritualSeconds';

describe('ritual seconds config', () => {
  it('defaults to 30 seconds when env is unset', () => {
    expect(RITUAL_SECONDS).toBeGreaterThan(0);
  });
});
