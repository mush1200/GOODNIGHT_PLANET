import type { Pool } from 'pg';

import { getLogicalSleepDate } from '../logicalDate.js';
import {
  type PushEmotionalState,
  type PushToneContext,
  derivePushEmotionalState,
} from '../pushEmotionalState.js';
import { worldAttunementState } from '../worldAttunement.js';

export async function loadPushToneContext(
  pool: Pool,
  user: {
    id: string;
    streak_days: number;
    last_open_at: string | Date | null;
  },
): Promise<PushToneContext> {
  const logicalSleepDate = getLogicalSleepDate();
  const daily = await pool.query<{
    ritual_countdown_completed: boolean;
    sleep_started_at: string | null;
    early_bed_for_dream: boolean;
  }>(
    `SELECT ritual_countdown_completed, sleep_started_at, early_bed_for_dream
     FROM daily_states
     WHERE user_id = $1 AND logical_sleep_date = $2::date`,
    [user.id, logicalSleepDate],
  );
  const row = daily.rows[0];
  const lastOpenAt = user.last_open_at ? new Date(user.last_open_at) : null;
  const attunement = worldAttunementState({
    lastOpenAt,
    now: new Date(),
    ritualCountdownCompleted: Boolean(row?.ritual_countdown_completed),
    sleepStarted: Boolean(row?.sleep_started_at),
  });

  return {
    worldAttunement: attunement.worldAttunement,
    daysSinceLastOpenLogical: attunement.daysSinceLastOpenLogical,
    earlyBedForDream: row?.early_bed_for_dream ?? false,
    streakDays: user.streak_days,
  };
}

export async function resolvePushEmotionalStateForUser(
  pool: Pool,
  user: {
    id: string;
    streak_days: number;
    last_open_at: string | Date | null;
  },
): Promise<PushEmotionalState> {
  const ctx = await loadPushToneContext(pool, user);
  return derivePushEmotionalState(ctx);
}
