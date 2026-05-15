import { getLogicalSleepDate, logicalDaysBetween } from './logicalDate.js';

/**
 * game_balance_tables.md §7 world_attunement — W1 閾值 N1（`days_since_last_open > N1` 則蔫）。
 * `days_since_last_open`：以 `last_open_at` 與當下 `now` 各自對應的 `logical_sleep_date` 之差（整日）。
 */
export const WORLD_ATTUNEMENT_WILT_EXCLUSIVE_THRESHOLD = 3;

export type WorldAttunementKind = 'steady' | 'wilted' | 'recovering';

export function logicalDaysSinceLastOpen(lastOpenAt: Date | null, now: Date = new Date()): number {
  if (!lastOpenAt) return 0;
  const nowLogical = getLogicalSleepDate(now);
  const openLogical = getLogicalSleepDate(lastOpenAt);
  return logicalDaysBetween(nowLogical, openLogical);
}

/**
 * W1：久未開啟 → 蔫；W2：今晚已進入晚安儀式（倒數完成或已按睡）→ 恢復預設敘事。
 */
export function worldAttunementState(args: {
  lastOpenAt: Date | null;
  now: Date;
  ritualCountdownCompleted: boolean;
  sleepStarted: boolean;
}): {
  worldAttunement: WorldAttunementKind;
  daysSinceLastOpenLogical: number;
  attunementHint: string | null;
} {
  const daysSince = logicalDaysSinceLastOpen(args.lastOpenAt, args.now);
  const engagedTonight = args.ritualCountdownCompleted || args.sleepStarted;
  const wouldWilt = daysSince > WORLD_ATTUNEMENT_WILT_EXCLUSIVE_THRESHOLD;

  if (engagedTonight && wouldWilt) {
    return {
      worldAttunement: 'recovering',
      daysSinceLastOpenLogical: daysSince,
      attunementHint: '你回來了，小屋的光也慢慢亮回來。',
    };
  }
  if (engagedTonight) {
    return { worldAttunement: 'steady', daysSinceLastOpenLogical: daysSince, attunementHint: null };
  }
  if (wouldWilt) {
    return {
      worldAttunement: 'wilted',
      daysSinceLastOpenLogical: daysSince,
      attunementHint: '我們等你好久了，小屋還在這裡。',
    };
  }
  return { worldAttunement: 'steady', daysSinceLastOpenLogical: daysSince, attunementHint: null };
}
