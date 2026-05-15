import { afterAll, describe, expect, it } from 'vitest';
import { pool } from '../src/index.js';

/**
 * DB schema 快照（對齊 §十 與 migrations/001~006）— checklist 3.1
 *
 * 目的：確保未來 migration drift 會被立刻發現；不檢查可選欄位的精細型別位元，
 * 只檢查「鍵 + 是否 NOT NULL」這層契約。
 *
 * 需要 DATABASE_URL；未設定時整檔 skip（與其他整合測試一致）。
 */
const hasDb = Boolean(process.env.DATABASE_URL);

type Column = { name: string; notnull: boolean };
const NN = (name: string): Column => ({ name, notnull: true });
const NL = (name: string): Column => ({ name, notnull: false });

const EXPECTED: Record<string, Column[]> = {
  users: [
    NN('id'),
    NN('device_id'),
    NN('created_at'),
    NL('last_open_at'),
    NN('streak_days'),
    NN('world_growth_value'),
    NN('world_tier'),
    NN('nights_completed'),
    NL('last_completed_logical_date'),
    NN('stardust_balance'),
    NL('target_sleep_time_local'),
    NL('wake_time_local'),
    NN('push_reminder_enabled'),
  ],
  pets: [NN('id'), NN('user_id'), NN('archetype'), NN('display_name')],
  night_sky_definitions: [NN('key'), NN('display_name'), NN('rarity'), NN('forecast_summary')],
  daily_states: [
    NN('id'),
    NN('user_id'),
    NN('logical_sleep_date'),
    NN('night_sky_state_key'),
    NN('ritual_countdown_done'),
    NL('sleep_started_at'),
    NL('wake_at'),
    NN('unboxed'),
    NN('ritual_countdown_completed'),
    NN('day_closure_completed'),
    NN('day_closure_skipped'),
    NN('early_bed_for_dream'),
  ],
  sleep_records: [
    NN('id'),
    NN('user_id'),
    NN('logical_sleep_date'),
    NN('source'),
    NN('started_at'),
    NL('ended_at'),
    NL('dream_key'),
  ],
  memory_entries: [
    NN('id'),
    NN('user_id'),
    NN('logical_sleep_date'),
    NN('dream_key'),
    NN('night_sky_key'),
    NN('narrative'),
    NN('created_at'),
  ],
  stardust_ledger: [
    NN('id'),
    NN('user_id'),
    NL('logical_sleep_date'),
    NN('delta'),
    NN('reason'),
    NN('created_at'),
  ],
  moon_guard_usage: [NN('user_id'), NN('iso_week'), NN('uses')],
};

describe.skipIf(!hasDb)('DB schema snapshot (requires DATABASE_URL) — §十／checklist 3.1', () => {
  afterAll(async () => {
    await pool.end();
  });

  for (const [table, cols] of Object.entries(EXPECTED)) {
    it(`table ${table} has expected columns & nullability`, async () => {
      const r = await pool.query<{ column_name: string; is_nullable: 'YES' | 'NO' }>(
        `SELECT column_name, is_nullable
           FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = $1
          ORDER BY column_name`,
        [table],
      );
      const got = new Map(r.rows.map((x) => [x.column_name, x.is_nullable === 'NO']));
      for (const c of cols) {
        expect(got.has(c.name), `${table}.${c.name} missing`).toBe(true);
        expect(got.get(c.name), `${table}.${c.name} nullability mismatch`).toBe(c.notnull);
      }
    });
  }

  it('night_sky_definitions seed rows match Vertical Slice keys', async () => {
    const r = await pool.query<{ key: string }>(
      `SELECT key FROM night_sky_definitions ORDER BY key`,
    );
    const keys = r.rows.map((x) => x.key).sort();
    expect(keys).toEqual(['blue_moon', 'clear_star', 'soft_rain']);
  });

  it('daily_states unique on (user_id, logical_sleep_date)', async () => {
    const r = await pool.query<{ indexdef: string }>(
      `SELECT indexdef FROM pg_indexes WHERE schemaname='public' AND tablename='daily_states'`,
    );
    const joined = r.rows.map((x) => x.indexdef).join('\n');
    expect(joined).toMatch(/UNIQUE.*\(user_id, logical_sleep_date\)/i);
  });
});
