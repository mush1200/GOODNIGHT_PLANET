import { subHours } from 'date-fns';

/** Hour after which the calendar day advances for sleep logic (see game_balance_tables.md). */
export function getSleepRolloverHour(): number {
  const raw = process.env.SLEEP_ROLLOVER_HOUR;
  const n = raw ? Number(raw) : 5;
  return Number.isFinite(n) ? n : 5;
}

/** MVP default aligns with mobile `CLIENT_TIMEZONE` (§4.6). */
export function getUserTimezone(): string {
  const tz = process.env.USER_TIMEZONE?.trim();
  return tz || 'Asia/Taipei';
}

export function localDateKeyInTimezone(date: Date, timeZone = getUserTimezone()): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const y = parts.find((p) => p.type === 'year')?.value;
  const m = parts.find((p) => p.type === 'month')?.value;
  const d = parts.find((p) => p.type === 'day')?.value;
  return `${y}-${m}-${d}`;
}

/**
 * §4.6: local calendar date of `(now − SLEEP_ROLLOVER_HOUR hours)` in the user timezone.
 */
export function getLogicalSleepDate(now: Date = new Date()): string {
  const shifted = subHours(now, getSleepRolloverHour());
  return localDateKeyInTimezone(shifted);
}

/** Difference in whole days between two YYYY-MM-DD strings (a − b). */
export function logicalDaysBetween(a: string, b: string): number {
  const da = new Date(`${a}T00:00:00.000Z`);
  const db = new Date(`${b}T00:00:00.000Z`);
  return Math.round((da.getTime() - db.getTime()) / 86400000);
}
