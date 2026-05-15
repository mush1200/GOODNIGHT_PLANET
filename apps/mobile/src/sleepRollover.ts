import { CLIENT_TIMEZONE, localHourInTimezone } from './timezone';

/** Aligns with docs/game_balance_tables.md §1 and API `getSleepRolloverHour()` default. */
export const DEFAULT_SLEEP_ROLLOVER_HOUR = 5;

export function isBeforeLogicalRollover(
  now = new Date(),
  rolloverHour = DEFAULT_SLEEP_ROLLOVER_HOUR,
  timeZone = CLIENT_TIMEZONE,
): boolean {
  return localHourInTimezone(now, timeZone) < rolloverHour;
}
