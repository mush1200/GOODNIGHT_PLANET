import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  getLogicalSleepDate,
  getSleepRolloverHour,
  getUserTimezone,
  localDateKeyInTimezone,
  logicalDaysBetween,
} from '../src/logicalDate.js';

describe('getSleepRolloverHour', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('defaults to 5 when unset', () => {
    vi.stubEnv('SLEEP_ROLLOVER_HOUR', '');
    expect(getSleepRolloverHour()).toBe(5);
  });

  it('reads numeric env', () => {
    vi.stubEnv('SLEEP_ROLLOVER_HOUR', '6');
    expect(getSleepRolloverHour()).toBe(6);
  });

  it('falls back when env is not finite', () => {
    vi.stubEnv('SLEEP_ROLLOVER_HOUR', 'nan');
    expect(getSleepRolloverHour()).toBe(5);
  });
});

describe('getUserTimezone', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('defaults to Asia/Taipei', () => {
    vi.stubEnv('USER_TIMEZONE', '');
    expect(getUserTimezone()).toBe('Asia/Taipei');
  });
});

describe('getLogicalSleepDate', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('uses previous local calendar day when hour is before rollover (UTC slice)', () => {
    vi.stubEnv('SLEEP_ROLLOVER_HOUR', '5');
    vi.stubEnv('USER_TIMEZONE', 'UTC');
    const now = new Date(Date.UTC(2026, 4, 13, 4, 59, 0));
    expect(getLogicalSleepDate(now)).toBe('2026-05-12');
  });

  it('uses same local calendar day at rollover hour (UTC slice)', () => {
    vi.stubEnv('SLEEP_ROLLOVER_HOUR', '5');
    vi.stubEnv('USER_TIMEZONE', 'UTC');
    const now = new Date(Date.UTC(2026, 4, 13, 5, 0, 0));
    expect(getLogicalSleepDate(now)).toBe('2026-05-13');
  });

  it('aligns with Asia/Taipei local date after subtracting rollover hours (§4.6)', () => {
    vi.stubEnv('SLEEP_ROLLOVER_HOUR', '5');
    vi.stubEnv('USER_TIMEZONE', 'Asia/Taipei');
    const now = new Date('2026-05-13T02:30:00+08:00');
    expect(getLogicalSleepDate(now)).toBe('2026-05-12');
    expect(localDateKeyInTimezone(now, 'Asia/Taipei')).toBe('2026-05-13');
  });
});

describe('logicalDaysBetween', () => {
  it('returns whole-day difference a − b', () => {
    expect(logicalDaysBetween('2026-05-14', '2026-05-13')).toBe(1);
    expect(logicalDaysBetween('2026-05-13', '2026-05-13')).toBe(0);
    expect(logicalDaysBetween('2026-05-12', '2026-05-14')).toBe(-2);
  });
});
