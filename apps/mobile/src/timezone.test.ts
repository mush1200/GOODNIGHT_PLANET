import { describe, expect, it } from 'vitest';
import { CLIENT_TIMEZONE, formatLogicalDateForDisplay, localDateKeyInTimezone, localHourInTimezone } from './timezone';
import { DEFAULT_SLEEP_ROLLOVER_HOUR, isBeforeLogicalRollover } from './sleepRollover';

describe('timezone display (7.3.2 / 9.3.1)', () => {
  it('formats logical dates for UI without raw keys', () => {
    expect(formatLogicalDateForDisplay('2026-05-12')).toBe('2026 年 5 月 12 日');
  });

  it('uses Asia/Taipei for local date keys', () => {
    const key = localDateKeyInTimezone(new Date('2026-05-12T16:30:00.000Z'), CLIENT_TIMEZONE);
    expect(key).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('defaults rollover hour to balance table SSOT', () => {
    expect(DEFAULT_SLEEP_ROLLOVER_HOUR).toBe(5);
    expect(isBeforeLogicalRollover(new Date('2026-05-13T04:30:00+08:00'))).toBe(true);
    expect(isBeforeLogicalRollover(new Date('2026-05-13T06:00:00+08:00'))).toBe(false);
  });

  it('reads local hour in Asia/Taipei for rollover hints', () => {
    expect(localHourInTimezone(new Date('2026-05-13T04:30:00+08:00'))).toBe(4);
    expect(localHourInTimezone(new Date('2026-05-13T06:00:00+08:00'))).toBe(6);
  });
});
