import { getISOWeek, getISOWeekYear } from 'date-fns';

/** ISO week id e.g. `2026-W19` — moon_guard 每曆週一次（game_balance_tables §6） */
export function moonGuardIsoWeek(d: Date = new Date()): string {
  return `${getISOWeekYear(d)}-W${String(getISOWeek(d)).padStart(2, '0')}`;
}
