import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { NIGHT_SKY_DEFINITION_SSOT } from '../src/balance.js';
import { app, pool } from '../src/index.js';
import { STARDUST_FULL_NIGHT_FLOW_TOTAL } from '../src/stardust.js';

const hasDb = Boolean(process.env.DATABASE_URL);

describe.skipIf(!hasDb)('HTTP API (requires DATABASE_URL)', () => {
  const deviceId = `test-${crypto.randomUUID()}`;

  beforeAll(async () => {
    await pool.query('DELETE FROM users WHERE device_id = $1', [deviceId]);
  });

  afterAll(async () => {
    await pool.query('DELETE FROM users WHERE device_id = $1', [deviceId]);
    await pool.end();
  });

  it('GET /health', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  it('GET /v1/push/template-goodnight — push payload (2.5.5)', async () => {
    const d = `test-push-template-${crypto.randomUUID()}`;
    await pool.query('DELETE FROM users WHERE device_id = $1', [d]);
    await request(app).post('/v1/bootstrap').send({ deviceId: d });

    const noAuth = await request(app).get('/v1/push/template-goodnight?templateKey=evening_nudge');
    expect(noAuth.status).toBe(401);

    const bad = await request(app).get('/v1/push/template-goodnight?templateKey=nope').set('x-device-id', d);
    expect(bad.status).toBe(400);
    expect(bad.body.error).toBe('invalid_query');

    const ok = await request(app)
      .get('/v1/push/template-goodnight?templateKey=evening_nudge')
      .set('x-device-id', d);
    expect(ok.status).toBe(200);
    expect(ok.body).toMatchObject({
      channel: 'push',
      templateKey: 'evening_nudge',
      petArchetype: 'gentle',
    });
    expect(String(ok.body.body)).toMatch(/\S/);
    expect(String(ok.body.body).length).toBeLessThanOrEqual(48);

    await pool.query('DELETE FROM users WHERE device_id = $1', [d]);
  });

  it('night_sky_definitions matches NIGHT_SKY_DEFINITION_SSOT (seed / game_balance_tables)', async () => {
    const db = await pool.query<{
      key: string;
      display_name: string;
      rarity: string;
      forecast_summary: string;
    }>(`SELECT key, display_name, rarity, forecast_summary FROM night_sky_definitions ORDER BY key`);
    const sorted = [...db.rows].sort((a, b) => a.key.localeCompare(b.key));
    const expected = [...NIGHT_SKY_DEFINITION_SSOT].sort((a, b) => a.key.localeCompare(b.key));
    expect(sorted).toEqual(expected);
  });

  it('POST /v1/bootstrap rejects short deviceId', async () => {
    const res = await request(app).post('/v1/bootstrap').send({ deviceId: 'abc' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('invalid_body');
  });

  it(
    'full night flow: bootstrap → today → ritual → sleep → wake → unbox',
    async () => {
      const boot = await request(app).post('/v1/bootstrap').send({ deviceId });
      expect(boot.status).toBe(200);
      expect(boot.body.userId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      );
      expect(boot.body.petName).toBe('小燈');
      expect(boot.body.petArchetype).toBe('gentle');

      const boot2 = await request(app).post('/v1/bootstrap').send({ deviceId });
      expect(boot2.status).toBe(200);
      expect(boot2.body.userId).toBe(boot.body.userId);
      expect(boot2.body.petArchetype).toBe('gentle');

      const noDevice = await request(app).get('/v1/today');
      expect(noDevice.status).toBe(401);

      const today1 = await request(app).get('/v1/today').set('x-device-id', deviceId);
      expect(today1.status).toBe(200);
      expect(today1.body.logicalSleepDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(today1.body.nightSky?.key).toMatch(/^(clear_star|soft_rain|blue_moon)$/);
      expect(today1.body.rarityNarrativeTag).toMatch(/\S/);
      expect(today1.body.forecastSummary).toMatch(/\S/);
      expect(today1.body.worldTier).toBeGreaterThanOrEqual(1);
      expect(today1.body.worldTier).toBeLessThanOrEqual(4);
      expect(typeof today1.body.worldGrowthValue).toBe('number');
      expect(today1.body.worldProgressFraction).toBeGreaterThanOrEqual(0);
      expect(today1.body.worldProgressFraction).toBeLessThanOrEqual(1);
      expect(today1.body.goodnightLine).toMatch(/\S/);
      expect(today1.body.petArchetype).toBe('gentle');
      const ipUnsafe = /SSR|UR\b|NO\.\s*\d+|圖鑑/u;
      expect(String(today1.body.rarityNarrativeTag)).not.toMatch(ipUnsafe);
      expect(String(today1.body.forecastSummary)).not.toMatch(ipUnsafe);
      expect(today1.body.ritualCountdownCompleted).toBe(false);
      expect(today1.body.sleeping).toBe(false);
      expect(today1.body.dayClosureCompleted).toBe(false);
      expect(today1.body.dayClosureSkipped).toBe(false);
      expect(today1.body.nightsCompleted).toBe(0);
      expect(today1.body.lastCompletedLogicalDate).toBeNull();
      expect(today1.body.lastSleepLogicalDate).toBeNull();
      expect(today1.body.worldAttunement).toBe('steady');
      expect(today1.body.daysSinceLastOpenLogical).toBe(0);
      expect(today1.body.attunementHint).toBeNull();
      expect(today1.body.stardustBalance).toBe(0);
      expect(today1.body.onboardingPhase).toBe('first_night');
      expect(today1.body.homeDockHint).toMatch(/\S/);

      const ritual = await request(app)
        .post('/v1/ritual/countdown-complete')
        .set('x-device-id', deviceId);
      expect(ritual.status).toBe(200);
      expect(ritual.body.ritualCountdownCompleted).toBe(true);

      const start = await request(app).post('/v1/sleep/start').set('x-device-id', deviceId);
      expect(start.status).toBe(200);
      expect(start.body.sleeping).toBe(true);

      const todaySleeping = await request(app).get('/v1/today').set('x-device-id', deviceId);
      expect(todaySleeping.status).toBe(200);
      expect(todaySleeping.body.sleepStarted).toBe(true);
      expect(todaySleeping.body.sleeping).toBe(true);

      const wake = await request(app).post('/v1/sleep/wake').set('x-device-id', deviceId);
      expect(wake.status).toBe(200);
      expect(wake.body.sleeping).toBe(false);

      const unbox = await request(app).post('/v1/unbox').set('x-device-id', deviceId);
      expect(unbox.status).toBe(200);
      expect(unbox.body.dreamKey).toBeTruthy();
      expect(unbox.body.dreamName).toBeTruthy();
      expect(unbox.body.memoryLine).toContain('今晚記住了');
      expect(unbox.body.stardustBalance).toBe(STARDUST_FULL_NIGHT_FLOW_TOTAL);
      expect(unbox.body.worldGrowthValue).toBeGreaterThan(today1.body.worldGrowthValue);

      const todayAfterUnbox = await request(app).get('/v1/today').set('x-device-id', deviceId);
      expect(todayAfterUnbox.status).toBe(200);
      expect(todayAfterUnbox.body.sleeping).toBe(false);
      expect(todayAfterUnbox.body.streakDays).toBeGreaterThanOrEqual(1);
      expect(todayAfterUnbox.body.nightsCompleted).toBeGreaterThanOrEqual(1);
      expect(todayAfterUnbox.body.lastCompletedLogicalDate).toBe(today1.body.logicalSleepDate);
      expect(todayAfterUnbox.body.lastSleepLogicalDate).toBe(today1.body.logicalSleepDate);
      expect(todayAfterUnbox.body.stardustBalance).toBe(STARDUST_FULL_NIGHT_FLOW_TOTAL);
      expect(todayAfterUnbox.body.onboardingPhase).toBe('first_week');

      const uidRow = await pool.query<{ id: string }>(`SELECT id FROM users WHERE device_id = $1`, [deviceId]);
      const sum = await pool.query<{ s: number }>(
        `SELECT coalesce(sum(delta), 0)::int AS s FROM stardust_ledger WHERE user_id = $1`,
        [uidRow.rows[0].id],
      );
      expect(sum.rows[0].s).toBe(STARDUST_FULL_NIGHT_FLOW_TOTAL);

      const unbox2 = await request(app).post('/v1/unbox').set('x-device-id', deviceId);
      expect(unbox2.status).toBe(400);
      expect(unbox2.body.error).toBe('already_unboxed');

      const memories = await request(app).get('/v1/memory-entries').set('x-device-id', deviceId);
      expect(memories.status).toBe(200);
      expect(memories.body.items?.length).toBeGreaterThanOrEqual(1);
      expect(memories.body.items[0].narrative).toContain('今晚記住了');
      expect(memories.body.items[0].logicalSleepDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    },
    20_000,
  );

  it('cancel_sleep: idempotent when not started; reverts growth after sleep/start', async () => {
    const d = `test-cancel-${crypto.randomUUID()}`;
    await pool.query('DELETE FROM users WHERE device_id = $1', [d]);
    await request(app).post('/v1/bootstrap').send({ deviceId: d });
    const today0 = await request(app).get('/v1/today').set('x-device-id', d);
    const g0 = today0.body.worldGrowthValue as number;
    expect(today0.body.stardustBalance).toBe(0);
    await request(app).post('/v1/ritual/countdown-complete').set('x-device-id', d);
    const idle = await request(app).post('/v1/sleep/cancel').set('x-device-id', d);
    expect(idle.status).toBe(200);
    expect(idle.body.cancelled).toBe(false);
    expect(idle.body.message).toMatch(/\S/);
    expect(String(idle.body.message)).not.toMatch(/失敗|活該|丟臉/i);

    await request(app).post('/v1/sleep/start').set('x-device-id', d);
    const today1 = await request(app).get('/v1/today').set('x-device-id', d);
    expect(today1.body.worldGrowthValue).toBe(g0 + 10);

    const cancelled = await request(app).post('/v1/sleep/cancel').set('x-device-id', d);
    expect(cancelled.status).toBe(200);
    expect(cancelled.body.cancelled).toBe(true);
    expect(String(cancelled.body.message)).not.toMatch(/失敗|活該|丟臉/i);
    const today2 = await request(app).get('/v1/today').set('x-device-id', d);
    expect(today2.body.worldGrowthValue).toBe(g0);
    expect(today2.body.sleepStarted).toBe(false);
    expect(today2.body.stardustBalance).toBe(1);

    await pool.query('DELETE FROM users WHERE device_id = $1', [d]);
  });

  it('cancel_sleep: after wake reverts start+wake growth bump', async () => {
    const d = `test-cancel-wake-${crypto.randomUUID()}`;
    await pool.query('DELETE FROM users WHERE device_id = $1', [d]);
    await request(app).post('/v1/bootstrap').send({ deviceId: d });
    const today0 = await request(app).get('/v1/today').set('x-device-id', d);
    const g0 = today0.body.worldGrowthValue as number;
    expect(today0.body.stardustBalance).toBe(0);
    await request(app).post('/v1/ritual/countdown-complete').set('x-device-id', d);
    await request(app).post('/v1/sleep/start').set('x-device-id', d);
    await request(app).post('/v1/sleep/wake').set('x-device-id', d);
    const todayMid = await request(app).get('/v1/today').set('x-device-id', d);
    expect(todayMid.body.worldGrowthValue).toBe(g0 + 15);

    const cancelled = await request(app).post('/v1/sleep/cancel').set('x-device-id', d);
    expect(cancelled.status).toBe(200);
    expect(cancelled.body.cancelled).toBe(true);
    expect(String(cancelled.body.message)).not.toMatch(/失敗|活該|丟臉/i);
    const todayAfter = await request(app).get('/v1/today').set('x-device-id', d);
    expect(todayAfter.body.worldGrowthValue).toBe(g0);
    expect(todayAfter.body.stardustBalance).toBe(1);

    await pool.query('DELETE FROM users WHERE device_id = $1', [d]);
  });

  it('sleep_records manual backfill sets source = manual', async () => {
    const d = `test-manual-${crypto.randomUUID()}`;
    await pool.query('DELETE FROM users WHERE device_id = $1', [d]);
    const boot = await request(app).post('/v1/bootstrap').send({ deviceId: d });
    const logical = '2024-01-15';
    const res = await request(app)
      .post('/v1/sleep/manual-record')
      .set('x-device-id', d)
      .send({
        logicalSleepDate: logical,
        startedAt: '2024-01-15T23:30:00.000Z',
        endedAt: '2024-01-16T06:00:00.000Z',
        dreamKey: 'star_path',
      });
    expect(res.status).toBe(201);
    expect(res.body.source).toBe('manual');
    const uid = boot.body.userId as string;
    const row = await pool.query<{ source: string }>(
      `SELECT source FROM sleep_records WHERE user_id = $1 AND logical_sleep_date = $2::date`,
      [uid, logical],
    );
    expect(row.rows[0]?.source).toBe('manual');

    const todayAfter = await request(app).get('/v1/today').set('x-device-id', d);
    expect(todayAfter.status).toBe(200);
    expect(todayAfter.body.lastSleepLogicalDate).toBe(logical);

    await pool.query('DELETE FROM users WHERE device_id = $1', [d]);
  });

  it('GET /v1/today worldAttunement: wilted when stale last_open; recovering after ritual (2.6.2)', async () => {
    const d = `test-attune-${crypto.randomUUID()}`;
    await pool.query('DELETE FROM users WHERE device_id = $1', [d]);
    const boot = await request(app).post('/v1/bootstrap').send({ deviceId: d });
    const uid = boot.body.userId as string;
    await request(app).get('/v1/today').set('x-device-id', d);

    await pool.query(`UPDATE users SET last_open_at = now() - interval '10 days' WHERE id = $1`, [uid]);
    await pool.query(
      `UPDATE daily_states SET ritual_countdown_completed = false, ritual_countdown_done = false,
         sleep_started_at = NULL, wake_at = NULL, unboxed = false
       WHERE user_id = $1`,
      [uid],
    );

    const wilted = await request(app).get('/v1/today').set('x-device-id', d);
    expect(wilted.status).toBe(200);
    expect(wilted.body.worldAttunement).toBe('wilted');
    expect(wilted.body.daysSinceLastOpenLogical).toBeGreaterThan(3);
    expect(wilted.body.attunementHint).toMatch(/小屋|等你/);
    expect(String(wilted.body.attunementHint)).not.toMatch(/失敗|活該|丟臉|你又不|沒救了/i);

    await pool.query(`UPDATE users SET last_open_at = now() - interval '10 days' WHERE id = $1`, [uid]);
    await request(app).post('/v1/ritual/countdown-complete').set('x-device-id', d);

    const rec = await request(app).get('/v1/today').set('x-device-id', d);
    expect(rec.status).toBe(200);
    expect(rec.body.worldAttunement).toBe('recovering');
    expect(rec.body.attunementHint).toMatch(/\S/);
    expect(String(rec.body.attunementHint)).not.toMatch(/失敗|活該|丟臉|你又不|沒救了/i);

    await pool.query('DELETE FROM users WHERE device_id = $1', [d]);
  });

  it('day_closure: requires daily_state; complete/skip toggles on logical day', async () => {
    const d = `test-day-closure-${crypto.randomUUID()}`;
    await pool.query('DELETE FROM users WHERE device_id = $1', [d]);
    await request(app).post('/v1/bootstrap').send({ deviceId: d });

    const noState = await request(app).post('/v1/ritual/day-closure').set('x-device-id', d).send({ action: 'complete' });
    expect(noState.status).toBe(400);
    expect(noState.body.error).toBe('no_daily_state');

    const bad = await request(app).post('/v1/ritual/day-closure').set('x-device-id', d).send({ action: 'nope' });
    expect(bad.status).toBe(400);
    expect(bad.body.error).toBe('invalid_body');

    const today0 = await request(app).get('/v1/today').set('x-device-id', d);
    expect(today0.body.dayClosureCompleted).toBe(false);
    expect(today0.body.dayClosureSkipped).toBe(false);
    const logical = today0.body.logicalSleepDate as string;

    const done = await request(app).post('/v1/ritual/day-closure').set('x-device-id', d).send({ action: 'complete' });
    expect(done.status).toBe(200);
    expect(done.body.logicalSleepDate).toBe(logical);
    expect(done.body.dayClosureCompleted).toBe(true);
    expect(done.body.dayClosureSkipped).toBe(false);

    const today1 = await request(app).get('/v1/today').set('x-device-id', d);
    expect(today1.body.dayClosureCompleted).toBe(true);
    expect(today1.body.dayClosureSkipped).toBe(false);

    const skip = await request(app).post('/v1/ritual/day-closure').set('x-device-id', d).send({ action: 'skip' });
    expect(skip.status).toBe(200);
    expect(skip.body.dayClosureCompleted).toBe(false);
    expect(skip.body.dayClosureSkipped).toBe(true);

    const today2 = await request(app).get('/v1/today').set('x-device-id', d);
    expect(today2.body.dayClosureCompleted).toBe(false);
    expect(today2.body.dayClosureSkipped).toBe(true);

    await request(app).post('/v1/ritual/countdown-complete').set('x-device-id', d);
    const start = await request(app).post('/v1/sleep/start').set('x-device-id', d);
    expect(start.status).toBe(200);

    await pool.query('DELETE FROM users WHERE device_id = $1', [d]);
  });

  it('moon guard, sleep schedule, early-bed, reminder preview (2.8.1 / 2.9 / 2.8.4)', async () => {
    const d = `test-mvp-x-${crypto.randomUUID()}`;
    await pool.query('DELETE FROM users WHERE device_id = $1', [d]);
    await request(app).post('/v1/bootstrap').send({ deviceId: d });
    await request(app).get('/v1/today').set('x-device-id', d);

    const moon0 = await request(app).get('/v1/moon-guard/status').set('x-device-id', d);
    expect(moon0.status).toBe(200);
    expect(moon0.body.canUse).toBe(true);

    const m1 = await request(app).post('/v1/moon-guard/trigger').set('x-device-id', d);
    expect(m1.status).toBe(200);
    expect(m1.body.ok).toBe(true);

    const m2 = await request(app).post('/v1/moon-guard/trigger').set('x-device-id', d);
    expect(m2.status).toBe(200);
    expect(m2.body.ok).toBe(false);

    const patch = await request(app)
      .patch('/v1/me/sleep-schedule')
      .set('x-device-id', d)
      .send({ targetSleepTimeLocal: '22:30', wakeTimeLocal: '07:00', pushReminderEnabled: true });
    expect(patch.status).toBe(200);
    expect(patch.body.targetSleepDurationMinutes).toBe(510);

    const tday = await request(app).get('/v1/today').set('x-device-id', d);
    expect(tday.body.onboardingPhase).toBe('first_night');
    expect(tday.body.homeDockHint).toMatch(/\S/);
    expect(tday.body.moonGuardCanUse).toBe(false);
    expect(tday.body.targetSleepDurationMinutes).toBe(510);

    const eb = await request(app).post('/v1/daily/early-bed').set('x-device-id', d).send({ earlyBed: true });
    expect(eb.status).toBe(200);
    expect(eb.body.earlyBedForDream).toBe(true);

    const rem = await request(app).get('/v1/push/reminder-preview?templateKey=evening_nudge').set('x-device-id', d);
    expect(rem.status).toBe(200);
    expect(rem.body.mock).toBe(true);

    const row = await pool.query<{ early_bed_for_dream: boolean }>(
      `SELECT early_bed_for_dream FROM daily_states WHERE user_id = (SELECT id FROM users WHERE device_id = $1)`,
      [d],
    );
    expect(row.rows[0]?.early_bed_for_dream).toBe(true);

    await pool.query('DELETE FROM users WHERE device_id = $1', [d]);
  });
});
