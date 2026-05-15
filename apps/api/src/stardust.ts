import type pg from 'pg';

/** 與 `docs/game_balance_tables.md` §8 同步 — checklist 2.7.1 */
export const STARDUST_FOR_RITUAL_COUNTDOWN = 1;
export const STARDUST_FOR_SLEEP_START = 3;
export const STARDUST_FOR_SLEEP_WAKE = 1;
export const STARDUST_FOR_UNBOX = 10;

export const STARDUST_REASONS = [
  'ritual_countdown_complete',
  'sleep_start',
  'sleep_wake',
  'unbox',
  'cancel_sleep',
] as const;
export type StardustReason = (typeof STARDUST_REASONS)[number];

export const STARDUST_FULL_NIGHT_FLOW_TOTAL =
  STARDUST_FOR_RITUAL_COUNTDOWN +
  STARDUST_FOR_SLEEP_START +
  STARDUST_FOR_SLEEP_WAKE +
  STARDUST_FOR_UNBOX;

/** 與 `cancel_sleep` 成長回退量一致：僅 start →10；start+wake →15 */
export function stardustDeltaForCancelSleep(growthDeltaReverted: number): number {
  if (growthDeltaReverted === 15) return -(STARDUST_FOR_SLEEP_START + STARDUST_FOR_SLEEP_WAKE);
  if (growthDeltaReverted === 10) return -STARDUST_FOR_SLEEP_START;
  return 0;
}

export async function grantStardust(
  pool: pg.Pool,
  userId: string,
  logicalSleepDate: string,
  delta: number,
  reason: StardustReason,
): Promise<number> {
  const c = await pool.connect();
  try {
    await c.query('BEGIN');
    await c.query(
      `INSERT INTO stardust_ledger (user_id, logical_sleep_date, delta, reason)
       VALUES ($1, $2::date, $3, $4)`,
      [userId, logicalSleepDate, delta, reason],
    );
    const u = await c.query<{ stardust_balance: string }>(
      `UPDATE users SET stardust_balance = stardust_balance + $2 WHERE id = $1 RETURNING stardust_balance`,
      [userId, delta],
    );
    await c.query('COMMIT');
    return Number(u.rows[0]?.stardust_balance ?? 0);
  } catch (e) {
    await c.query('ROLLBACK');
    throw e;
  } finally {
    c.release();
  }
}
