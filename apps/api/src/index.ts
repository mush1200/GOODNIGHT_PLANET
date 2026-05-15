import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';
import { z } from 'zod';
import {
  DREAM_COPY,
  NightSkyKey,
  progressInTier,
  rarityNarrativeTag,
  rollDream,
  rollNightSky,
  tierFromGrowth,
} from './balance.js';
import { pickGoodnightLine } from './goodnightLines.js';
import { getLogicalSleepDate, logicalDaysBetween } from './logicalDate.js';
import { homeDockHint } from './homeDockHint.js';
import { moonGuardIsoWeek } from './moonGuardWeek.js';
import { onboardingPhase } from './onboarding.js';
import { resolvePushEmotionalStateForUser } from './push/loadPushToneContext.js';
import { buildReminderPushPayload } from './push/mockPush.js';
import { PUSH_EMOTIONAL_STATES } from './pushEmotionalState.js';
import {
  STARDUST_FOR_RITUAL_COUNTDOWN,
  STARDUST_FOR_SLEEP_START,
  STARDUST_FOR_SLEEP_WAKE,
  STARDUST_FOR_UNBOX,
  grantStardust,
  stardustDeltaForCancelSleep,
} from './stardust.js';
import { isValidLocalHm, targetSleepDurationMinutes } from './sleepSchedule.js';
import { normalizePetArchetype, pushTemplatePayload } from './templateGoodnight.js';
import { worldAttunementState } from './worldAttunement.js';
import { CANCEL_SLEEP_MESSAGES, MOON_GUARD_MESSAGES } from './userFacingStrings.js';

const PORT = Number(process.env.PORT ?? 3333);
export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

function isMainModule(): boolean {
  const entry = process.argv[1];
  if (!entry) return false;
  try {
    return import.meta.url === pathToFileURL(path.resolve(entry)).href;
  } catch {
    return false;
  }
}

export const app = express();
app.use(cors());
app.use(express.json());

/**
 * Swagger / OpenAPI docs
 *
 * - `GET /openapi.yaml`：原始 OpenAPI v0.2 規格（YAML 文本）
 * - `GET /openapi.json`：同上，轉 JSON
 * - `GET /docs`：互動式 Swagger UI（瀏覽器可直接打開）
 */
const OPENAPI_PATH = (() => {
  const here = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(here, '../../../contracts/openapi.yaml');
})();

let openapiYaml = '';
let openapiDoc: Record<string, unknown> = {};
try {
  openapiYaml = readFileSync(OPENAPI_PATH, 'utf8');
  openapiDoc = YAML.parse(openapiYaml) as Record<string, unknown>;
} catch (err) {
  console.warn(`[openapi] failed to load ${OPENAPI_PATH}:`, (err as Error).message);
}

app.get('/openapi.yaml', (_req, res) => {
  if (!openapiYaml) {
    res.status(500).type('text/plain').send('OpenAPI spec not loaded');
    return;
  }
  res.type('application/yaml').send(openapiYaml);
});

app.get('/openapi.json', (_req, res) => {
  if (!openapiYaml) {
    res.status(500).json({ error: 'openapi_not_loaded' });
    return;
  }
  res.json(openapiDoc);
});

app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(openapiDoc, {
    customSiteTitle: 'Goodnight Planet API — Swagger',
    customCss: '.swagger-ui .topbar { display: none; }',
    swaggerOptions: {
      url: '/openapi.yaml',
      persistAuthorization: true,
      docExpansion: 'list',
      tryItOutEnabled: true,
    },
  }),
);

const bootstrapBody = z.object({ deviceId: z.string().min(4) });

const dreamKeySchema = z.enum([
  'rain_city',
  'star_path',
  'train_whisper',
  'lake_mirror',
  'aurora_hint',
]);

const manualSleepBody = z.object({
  logicalSleepDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startedAt: z.string().datetime({ offset: true }),
  endedAt: z.string().datetime({ offset: true }).optional(),
  dreamKey: dreamKeySchema.optional(),
});

const dayClosureBody = z.object({
  action: z.enum(['complete', 'skip']),
});

const templateGoodnightQuery = z.object({
  templateKey: z.enum(['evening_nudge', 'ritual_invite']),
  pushEmotionalState: z.enum(PUSH_EMOTIONAL_STATES).optional(),
});

const sleepSchedulePatchBody = z.object({
  targetSleepTimeLocal: z.string().nullable().optional(),
  wakeTimeLocal: z.string().nullable().optional(),
  pushReminderEnabled: z.boolean().optional(),
});

const earlyBedBody = z.object({
  earlyBed: z.boolean(),
});

function rng(): () => number {
  return () => Math.random();
}

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

/** Push / system short copy — checklist 2.5.5（與 `goodnightLines` 分離） */
app.get('/v1/push/template-goodnight', async (req, res) => {
  const deviceId = req.header('x-device-id');
  const user = await getUser(deviceId);
  if (!user) {
    res.status(401).json({ error: 'missing_or_unknown_device' });
    return;
  }
  const parsed = templateGoodnightQuery.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: 'invalid_query' });
    return;
  }
  const arch = normalizePetArchetype(user.pet_archetype);
  const emotionalState =
    parsed.data.pushEmotionalState ??
    (await resolvePushEmotionalStateForUser(pool, user));
  res.json(pushTemplatePayload(parsed.data.templateKey, arch, emotionalState));
});

app.post('/v1/bootstrap', async (req, res) => {
  const parsed = bootstrapBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'invalid_body' });
    return;
  }
  const { deviceId } = parsed.data;
  const client = await pool.connect();
  try {
    const existing = await client.query<{ id: string }>(
      `SELECT id FROM users WHERE device_id = $1`,
      [deviceId],
    );
    if (existing.rows[0]) {
      await client.query(`UPDATE users SET last_open_at = now() WHERE id = $1`, [
        existing.rows[0].id,
      ]);
      const pet = await client.query<{ display_name: string; archetype: string }>(
        `SELECT display_name, archetype FROM pets WHERE user_id = $1`,
        [existing.rows[0].id],
      );
      res.json({
        userId: existing.rows[0].id,
        petName: pet.rows[0]?.display_name ?? '小燈',
        petArchetype: pet.rows[0]?.archetype ?? 'gentle',
      });
      return;
    }
    const u = await client.query<{ id: string }>(
      `INSERT INTO users (device_id, last_open_at) VALUES ($1, now()) RETURNING id`,
      [deviceId],
    );
    const userId = u.rows[0].id;
    await client.query(
      `INSERT INTO pets (user_id, archetype, display_name) VALUES ($1, 'gentle', '小燈')`,
      [userId],
    );
    res.json({ userId, petName: '小燈', petArchetype: 'gentle' });
  } finally {
    client.release();
  }
});

async function getUser(deviceId: string | undefined) {
  if (!deviceId) return null;
  const r = await pool.query<{
    id: string;
    streak_days: number;
    world_growth_value: number;
    world_tier: number;
    nights_completed: number;
    last_completed_logical_date: string | null;
    pet_archetype: string | null;
    last_open_at: string | null;
    stardust_balance: string;
    target_sleep_time_local: string | null;
    wake_time_local: string | null;
    push_reminder_enabled: boolean;
  }>(
    `SELECT u.id, u.streak_days, u.world_growth_value, u.world_tier, u.nights_completed,
            u.last_completed_logical_date::text AS last_completed_logical_date,
            u.last_open_at::text AS last_open_at,
            u.stardust_balance::text AS stardust_balance,
            u.target_sleep_time_local,
            u.wake_time_local,
            u.push_reminder_enabled,
            p.archetype AS pet_archetype
     FROM users u
     LEFT JOIN pets p ON p.user_id = u.id
     WHERE u.device_id = $1`,
    [deviceId],
  );
  return r.rows[0] ?? null;
}

app.get('/v1/today', async (req, res) => {
  const deviceId = req.header('x-device-id');
  const user = await getUser(deviceId);
  if (!user) {
    res.status(401).json({ error: 'missing_or_unknown_device' });
    return;
  }
  const logicalSleepDate = getLogicalSleepDate();

  const skyRow = await pool.query<{
    key: string;
    display_name: string;
    rarity: string;
    forecast_summary: string;
  }>(
    `SELECT d.night_sky_state_key AS key, n.display_name, n.rarity, n.forecast_summary
     FROM daily_states d
     JOIN night_sky_definitions n ON n.key = d.night_sky_state_key
     WHERE d.user_id = $1 AND d.logical_sleep_date = $2::date`,
    [user.id, logicalSleepDate],
  );

  let nightSkyKey: NightSkyKey;
  let displayName: string;
  let rarity: string;
  let forecastSummary: string;

  if (skyRow.rows[0]) {
    nightSkyKey = skyRow.rows[0].key as NightSkyKey;
    displayName = skyRow.rows[0].display_name;
    rarity = skyRow.rows[0].rarity;
    forecastSummary = skyRow.rows[0].forecast_summary;
  } else {
    nightSkyKey = rollNightSky({
      nightsCompleted: user.nights_completed,
      random: rng(),
    });
    const def = await pool.query<{
      display_name: string;
      rarity: string;
      forecast_summary: string;
    }>(`SELECT display_name, rarity, forecast_summary FROM night_sky_definitions WHERE key = $1`, [
      nightSkyKey,
    ]);
    displayName = def.rows[0].display_name;
    rarity = def.rows[0].rarity;
    forecastSummary = def.rows[0].forecast_summary;
    await pool.query(
      `INSERT INTO daily_states (user_id, logical_sleep_date, night_sky_state_key)
       VALUES ($1, $2::date, $3)`,
      [user.id, logicalSleepDate, nightSkyKey],
    );
  }

  const daily = await pool.query<{
    ritual_countdown_done: boolean;
    ritual_countdown_completed: boolean;
    sleep_started_at: string | null;
    unboxed: boolean;
    day_closure_completed: boolean;
    day_closure_skipped: boolean;
    early_bed_for_dream: boolean;
  }>(
    `SELECT ritual_countdown_done, ritual_countdown_completed, sleep_started_at, unboxed,
            day_closure_completed, day_closure_skipped, early_bed_for_dream
     FROM daily_states
     WHERE user_id = $1 AND logical_sleep_date = $2::date`,
    [user.id, logicalSleepDate],
  );
  const row = daily.rows[0];
  const sleeping = Boolean(row?.sleep_started_at) && !row?.unboxed;
  const ritualCountdownCompleted = Boolean(row?.ritual_countdown_completed);
  const sleepStarted = Boolean(row?.sleep_started_at);

  const week = moonGuardIsoWeek();
  const moonRow = await pool.query<{ uses: string }>(
    `SELECT uses::text AS uses FROM moon_guard_usage WHERE user_id = $1 AND iso_week = $2`,
    [user.id, week],
  );
  const moonUsesThisWeek = Number(moonRow.rows[0]?.uses ?? 0);

  const lastSleep = await pool.query<{ d: string | null }>(
    `SELECT MAX(logical_sleep_date)::text AS d FROM sleep_records WHERE user_id = $1`,
    [user.id],
  );
  const lastSleepLogicalDate = lastSleep.rows[0]?.d ?? null;

  const tier = tierFromGrowth(user.world_growth_value);
  const worldProgressFraction = progressInTier(user.world_growth_value, tier);

  const lastOpenAt = user.last_open_at ? new Date(user.last_open_at) : null;
  const attunement = worldAttunementState({
    lastOpenAt,
    now: new Date(),
    ritualCountdownCompleted,
    sleepStarted,
  });

  const onboarding = onboardingPhase(user.nights_completed, row?.unboxed ?? false);
  const dock = homeDockHint({
    worldAttunement: attunement.worldAttunement,
    attunementHint: attunement.attunementHint,
    daysSinceLastOpenLogical: attunement.daysSinceLastOpenLogical,
  });
  const tBed = user.target_sleep_time_local;
  const tWake = user.wake_time_local;
  const durMin =
    tBed && tWake && isValidLocalHm(tBed) && isValidLocalHm(tWake)
      ? targetSleepDurationMinutes(tBed, tWake)
      : null;

  await pool.query(`UPDATE users SET last_open_at = now() WHERE id = $1`, [user.id]);

  res.json({
    logicalSleepDate,
    nightSky: { key: nightSkyKey, displayName },
    forecastSummary,
    rarityNarrativeTag: rarityNarrativeTag(rarity),
    streakDays: user.streak_days,
    nightsCompleted: user.nights_completed,
    lastCompletedLogicalDate: user.last_completed_logical_date,
    lastSleepLogicalDate,
    worldTier: tier,
    worldGrowthValue: user.world_growth_value,
    worldProgressFraction,
    worldAttunement: attunement.worldAttunement,
    daysSinceLastOpenLogical: attunement.daysSinceLastOpenLogical,
    attunementHint: attunement.attunementHint,
    homeDockHint: dock,
    onboardingPhase: onboarding,
    moonGuardIsoWeek: week,
    moonGuardUsesThisWeek: moonUsesThisWeek,
    moonGuardCanUse: moonUsesThisWeek < 1,
    targetSleepTimeLocal: tBed,
    wakeTimeLocal: tWake,
    targetSleepDurationMinutes: durMin,
    pushReminderEnabled: user.push_reminder_enabled,
    ritualCountdownCompleted,
    sleepStarted,
    sleeping,
    unboxed: row?.unboxed ?? false,
    dayClosureCompleted: row?.day_closure_completed ?? false,
    dayClosureSkipped: row?.day_closure_skipped ?? false,
    goodnightLine: pickGoodnightLine(logicalSleepDate + user.id),
    petArchetype: user.pet_archetype ?? 'gentle',
    stardustBalance: Number(user.stardust_balance),
    earlyBedForDream: row?.early_bed_for_dream ?? false,
  });
});

app.patch('/v1/me/sleep-schedule', async (req, res) => {
  const deviceId = req.header('x-device-id');
  const user = await getUser(deviceId);
  if (!user) {
    res.status(401).json({ error: 'missing_or_unknown_device' });
    return;
  }
  const parsed = sleepSchedulePatchBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'invalid_body' });
    return;
  }
  const { targetSleepTimeLocal, wakeTimeLocal, pushReminderEnabled } = parsed.data;
  if (targetSleepTimeLocal != null && !isValidLocalHm(targetSleepTimeLocal)) {
    res.status(400).json({ error: 'invalid_time_format' });
    return;
  }
  if (wakeTimeLocal != null && !isValidLocalHm(wakeTimeLocal)) {
    res.status(400).json({ error: 'invalid_time_format' });
    return;
  }
  if (
    targetSleepTimeLocal === undefined &&
    wakeTimeLocal === undefined &&
    pushReminderEnabled === undefined
  ) {
    res.status(400).json({ error: 'no_updates' });
    return;
  }
  const sets: string[] = [];
  const vals: unknown[] = [];
  let n = 1;
  if (targetSleepTimeLocal !== undefined) {
    sets.push(`target_sleep_time_local = $${n}`);
    vals.push(targetSleepTimeLocal);
    n += 1;
  }
  if (wakeTimeLocal !== undefined) {
    sets.push(`wake_time_local = $${n}`);
    vals.push(wakeTimeLocal);
    n += 1;
  }
  if (pushReminderEnabled !== undefined) {
    sets.push(`push_reminder_enabled = $${n}`);
    vals.push(pushReminderEnabled);
    n += 1;
  }
  vals.push(user.id);
  await pool.query(`UPDATE users SET ${sets.join(', ')} WHERE id = $${n}`, vals);
  const u2 = await getUser(deviceId);
  if (!u2) {
    res.status(500).json({ error: 'user_missing_after_update' });
    return;
  }
  const b = u2.target_sleep_time_local;
  const w = u2.wake_time_local;
  const durMin =
    b && w && isValidLocalHm(b) && isValidLocalHm(w) ? targetSleepDurationMinutes(b, w) : null;
  res.json({
    targetSleepTimeLocal: u2.target_sleep_time_local,
    wakeTimeLocal: u2.wake_time_local,
    pushReminderEnabled: u2.push_reminder_enabled,
    targetSleepDurationMinutes: durMin,
  });
});

app.post('/v1/daily/early-bed', async (req, res) => {
  const deviceId = req.header('x-device-id');
  const user = await getUser(deviceId);
  if (!user) {
    res.status(401).json({ error: 'missing_or_unknown_device' });
    return;
  }
  const parsed = earlyBedBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'invalid_body' });
    return;
  }
  const logicalSleepDate = getLogicalSleepDate();
  const u = await pool.query(
    `UPDATE daily_states SET early_bed_for_dream = $3
     WHERE user_id = $1 AND logical_sleep_date = $2::date
     RETURNING early_bed_for_dream`,
    [user.id, logicalSleepDate, parsed.data.earlyBed],
  );
  if (u.rowCount === 0) {
    res.status(400).json({ error: 'no_daily_state' });
    return;
  }
  const out = u.rows[0] as { early_bed_for_dream: boolean };
  res.json({ logicalSleepDate, earlyBedForDream: out.early_bed_for_dream });
});

app.get('/v1/moon-guard/status', async (req, res) => {
  const deviceId = req.header('x-device-id');
  const user = await getUser(deviceId);
  if (!user) {
    res.status(401).json({ error: 'missing_or_unknown_device' });
    return;
  }
  const week = moonGuardIsoWeek();
  const row = await pool.query<{ uses: string }>(
    `SELECT uses::text AS uses FROM moon_guard_usage WHERE user_id = $1 AND iso_week = $2`,
    [user.id, week],
  );
  const uses = Number(row.rows[0]?.uses ?? 0);
  res.json({ isoWeek: week, usesThisWeek: uses, canUse: uses < 1 });
});

app.post('/v1/moon-guard/trigger', async (req, res) => {
  const deviceId = req.header('x-device-id');
  const user = await getUser(deviceId);
  if (!user) {
    res.status(401).json({ error: 'missing_or_unknown_device' });
    return;
  }
  const week = moonGuardIsoWeek();
  const ins = await pool.query(
    `INSERT INTO moon_guard_usage (user_id, iso_week, uses) VALUES ($1, $2, 1)
     ON CONFLICT (user_id, iso_week) DO NOTHING RETURNING uses`,
    [user.id, week],
  );
  if (ins.rowCount === 0) {
    const cur = await pool.query<{ uses: number }>(
      `SELECT uses FROM moon_guard_usage WHERE user_id = $1 AND iso_week = $2`,
      [user.id, week],
    );
    if ((cur.rows[0]?.uses ?? 0) >= 1) {
      res.status(200).json({
        ok: false,
        error: 'on_cooldown',
        isoWeek: week,
        usesThisWeek: 1,
        message: MOON_GUARD_MESSAGES.cooldown,
      });
      return;
    }
  }
  res.json({
    ok: true,
    isoWeek: week,
    usesThisWeek: 1,
    message: MOON_GUARD_MESSAGES.success,
  });
});

app.get('/v1/push/reminder-preview', async (req, res) => {
  const deviceId = req.header('x-device-id');
  const user = await getUser(deviceId);
  if (!user) {
    res.status(401).json({ error: 'missing_or_unknown_device' });
    return;
  }
  const parsed = templateGoodnightQuery.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: 'invalid_query' });
    return;
  }
  const emotionalState =
    parsed.data.pushEmotionalState ??
    (await resolvePushEmotionalStateForUser(pool, user));
  res.json(
    buildReminderPushPayload({
      deviceId: deviceId!,
      templateKey: parsed.data.templateKey,
      petArchetype: user.pet_archetype,
      pushEmotionalState: emotionalState,
    }),
  );
});

app.post('/v1/ritual/countdown-complete', async (req, res) => {
  const deviceId = req.header('x-device-id');
  const user = await getUser(deviceId);
  if (!user) {
    res.status(401).json({ error: 'missing_or_unknown_device' });
    return;
  }
  const logicalSleepDate = getLogicalSleepDate();
  const u = await pool.query(
    `UPDATE daily_states SET ritual_countdown_completed = true
     WHERE user_id = $1 AND logical_sleep_date = $2::date
     RETURNING id`,
    [user.id, logicalSleepDate],
  );
  if (u.rowCount === 0) {
    res.status(400).json({ error: 'no_daily_state' });
    return;
  }
  await grantStardust(pool, user.id, logicalSleepDate, STARDUST_FOR_RITUAL_COUNTDOWN, 'ritual_countdown_complete');
  res.json({ logicalSleepDate, ritualCountdownCompleted: true });
});

/** 可選「今天結束儀式」— §六；不阻擋主晚安流（checklist 2.5.3） */
app.post('/v1/ritual/day-closure', async (req, res) => {
  const deviceId = req.header('x-device-id');
  const user = await getUser(deviceId);
  if (!user) {
    res.status(401).json({ error: 'missing_or_unknown_device' });
    return;
  }
  const parsed = dayClosureBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'invalid_body' });
    return;
  }
  const logicalSleepDate = getLogicalSleepDate();
  const completed = parsed.data.action === 'complete';
  const skipped = parsed.data.action === 'skip';
  const u = await pool.query<{
    day_closure_completed: boolean;
    day_closure_skipped: boolean;
  }>(
    `UPDATE daily_states
     SET day_closure_completed = $3, day_closure_skipped = $4
     WHERE user_id = $1 AND logical_sleep_date = $2::date
     RETURNING day_closure_completed, day_closure_skipped`,
    [user.id, logicalSleepDate, completed, skipped],
  );
  if (u.rowCount === 0) {
    res.status(400).json({ error: 'no_daily_state' });
    return;
  }
  const out = u.rows[0];
  res.json({
    logicalSleepDate,
    dayClosureCompleted: out.day_closure_completed,
    dayClosureSkipped: out.day_closure_skipped,
  });
});

app.post('/v1/sleep/start', async (req, res) => {
  const deviceId = req.header('x-device-id');
  const user = await getUser(deviceId);
  if (!user) {
    res.status(401).json({ error: 'missing_or_unknown_device' });
    return;
  }
  const logicalSleepDate = getLogicalSleepDate();
  const gate = await pool.query<{ ritual_countdown_completed: boolean }>(
    `SELECT ritual_countdown_completed FROM daily_states
     WHERE user_id = $1 AND logical_sleep_date = $2::date`,
    [user.id, logicalSleepDate],
  );
  if (!gate.rows[0]?.ritual_countdown_completed) {
    res.status(400).json({ error: 'ritual_incomplete' });
    return;
  }
  await pool.query(
    `UPDATE daily_states SET sleep_started_at = now(), ritual_countdown_done = true
     WHERE user_id = $1 AND logical_sleep_date = $2::date`,
    [user.id, logicalSleepDate],
  );
  const gStart = user.world_growth_value + 10;
  await pool.query(`UPDATE users SET world_growth_value = $2, world_tier = $3 WHERE id = $1`, [
    user.id,
    gStart,
    tierFromGrowth(gStart),
  ]);
  await grantStardust(pool, user.id, logicalSleepDate, STARDUST_FOR_SLEEP_START, 'sleep_start');
  res.json({ logicalSleepDate, sleeping: true });
});

app.post('/v1/sleep/wake', async (req, res) => {
  const deviceId = req.header('x-device-id');
  const user = await getUser(deviceId);
  if (!user) {
    res.status(401).json({ error: 'missing_or_unknown_device' });
    return;
  }
  const logicalSleepDate = getLogicalSleepDate();
  await pool.query(
    `UPDATE daily_states SET wake_at = now() WHERE user_id = $1 AND logical_sleep_date = $2::date`,
    [user.id, logicalSleepDate],
  );
  const gWake = user.world_growth_value + 5;
  await pool.query(`UPDATE users SET world_growth_value = $2, world_tier = $3 WHERE id = $1`, [
    user.id,
    gWake,
    tierFromGrowth(gWake),
  ]);
  await grantStardust(pool, user.id, logicalSleepDate, STARDUST_FOR_SLEEP_WAKE, 'sleep_wake');
  res.json({ logicalSleepDate, sleeping: false });
});

/** cancel_sleep — §5.3 / tone_of_voice.md §5.1 */
app.post('/v1/sleep/cancel', async (req, res) => {
  const deviceId = req.header('x-device-id');
  const user = await getUser(deviceId);
  if (!user) {
    res.status(401).json({ error: 'missing_or_unknown_device' });
    return;
  }
  const logicalSleepDate = getLogicalSleepDate();
  const state = await pool.query<{
    sleep_started_at: string | null;
    wake_at: string | null;
    unboxed: boolean;
  }>(
    `SELECT sleep_started_at, wake_at, unboxed FROM daily_states
     WHERE user_id = $1 AND logical_sleep_date = $2::date`,
    [user.id, logicalSleepDate],
  );
  if (!state.rows[0]) {
    res.status(400).json({
      error: 'no_daily_state',
      message: CANCEL_SLEEP_MESSAGES.no_daily_state,
    });
    return;
  }
  const row = state.rows[0];
  if (row.unboxed) {
    res.status(400).json({
      error: 'cannot_cancel',
      message: CANCEL_SLEEP_MESSAGES.cannot_cancel,
    });
    return;
  }
  if (!row.sleep_started_at) {
    res.status(200).json({
      cancelled: false,
      message: CANCEL_SLEEP_MESSAGES.not_started,
    });
    return;
  }
  const growthDelta = row.wake_at ? 15 : 10;
  const newGrowth = Math.max(0, user.world_growth_value - growthDelta);
  await pool.query(
    `UPDATE daily_states SET sleep_started_at = NULL, wake_at = NULL
     WHERE user_id = $1 AND logical_sleep_date = $2::date`,
    [user.id, logicalSleepDate],
  );
  await pool.query(`UPDATE users SET world_growth_value = $2, world_tier = $3 WHERE id = $1`, [
    user.id,
    newGrowth,
    tierFromGrowth(newGrowth),
  ]);
  const sd = stardustDeltaForCancelSleep(growthDelta);
  if (sd !== 0) {
    await grantStardust(pool, user.id, logicalSleepDate, sd, 'cancel_sleep');
  }
  res.status(200).json({
    cancelled: true,
    message: CANCEL_SLEEP_MESSAGES.cancelled_ok,
  });
});

app.post('/v1/sleep/manual-record', async (req, res) => {
  const deviceId = req.header('x-device-id');
  const user = await getUser(deviceId);
  if (!user) {
    res.status(401).json({ error: 'missing_or_unknown_device' });
    return;
  }
  const parsed = manualSleepBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'invalid_body' });
    return;
  }
  const { logicalSleepDate: dateStr, startedAt, endedAt, dreamKey } = parsed.data;
  const r = await pool.query(
    `INSERT INTO sleep_records (user_id, logical_sleep_date, source, started_at, ended_at, dream_key)
     VALUES ($1, $2::date, 'manual', $3::timestamptz, $4::timestamptz, $5)
     RETURNING id`,
    [user.id, dateStr, startedAt, endedAt ?? null, dreamKey ?? null],
  );
  res.status(201).json({ id: r.rows[0].id, logicalSleepDate: dateStr, source: 'manual' });
});

app.get('/v1/memory-entries', async (req, res) => {
  const deviceId = req.header('x-device-id');
  const user = await getUser(deviceId);
  if (!user) {
    res.status(401).json({ error: 'missing_or_unknown_device' });
    return;
  }
  const limit = Math.min(100, Math.max(1, Number(req.query.limit ?? 30) || 30));
  const rows = await pool.query<{
    id: string;
    logical_sleep_date: string;
    dream_key: string;
    night_sky_key: string;
    narrative: string;
    created_at: string;
  }>(
    `SELECT id, logical_sleep_date::text AS logical_sleep_date, dream_key, night_sky_key, narrative, created_at::text AS created_at
     FROM memory_entries WHERE user_id = $1 ORDER BY logical_sleep_date DESC, created_at DESC LIMIT $2`,
    [user.id, limit],
  );
  res.json({
    items: rows.rows.map((row) => ({
      id: row.id,
      logicalSleepDate: row.logical_sleep_date,
      dreamKey: row.dream_key,
      nightSkyKey: row.night_sky_key,
      narrative: row.narrative,
      createdAt: row.created_at,
    })),
  });
});

app.post('/v1/unbox', async (req, res) => {
  const deviceId = req.header('x-device-id');
  const user = await getUser(deviceId);
  if (!user) {
    res.status(401).json({ error: 'missing_or_unknown_device' });
    return;
  }
  const logicalSleepDate = getLogicalSleepDate();

  const state = await pool.query<{
    night_sky_state_key: string;
    unboxed: boolean;
    early_bed_for_dream: boolean;
  }>(
    `SELECT night_sky_state_key, unboxed, early_bed_for_dream FROM daily_states WHERE user_id = $1 AND logical_sleep_date = $2::date`,
    [user.id, logicalSleepDate],
  );
  if (!state.rows[0]) {
    res.status(400).json({ error: 'no_daily_state' });
    return;
  }
  if (state.rows[0].unboxed) {
    res.status(400).json({ error: 'already_unboxed' });
    return;
  }

  const nightKey = state.rows[0].night_sky_state_key as NightSkyKey;
  const dreamKey = rollDream(nightKey, rng(), { earlyBed: state.rows[0].early_bed_for_dream });
  const def = await pool.query<{ display_name: string }>(
    `SELECT display_name FROM night_sky_definitions WHERE key = $1`,
    [nightKey],
  );
  const nightLabel = def.rows[0]?.display_name ?? '夜空';
  const memoryLine = DREAM_COPY[dreamKey].memoryLine({ nightLabel });

  await pool.query(`UPDATE daily_states SET unboxed = true WHERE user_id = $1 AND logical_sleep_date = $2::date`, [
    user.id,
    logicalSleepDate,
  ]);

  let streak = user.streak_days;
  if (user.last_completed_logical_date) {
    const gap = logicalDaysBetween(logicalSleepDate, user.last_completed_logical_date);
    streak = gap === 1 ? streak + 1 : 1;
  } else {
    streak = 1;
  }

  const growthBump = 25;
  const newGrowth = user.world_growth_value + growthBump;
  const newTier = tierFromGrowth(newGrowth);

  await pool.query(
    `UPDATE users SET
       world_growth_value = world_growth_value + $2,
       world_tier = $3,
       nights_completed = nights_completed + 1,
       streak_days = $4,
       last_completed_logical_date = $5::date
     WHERE id = $1`,
    [user.id, growthBump, newTier, streak, logicalSleepDate],
  );

  await pool.query(
    `INSERT INTO memory_entries (user_id, logical_sleep_date, dream_key, night_sky_key, narrative)
     VALUES ($1, $2::date, $3, $4, $5)`,
    [user.id, logicalSleepDate, dreamKey, nightKey, memoryLine],
  );

  await pool.query(
    `INSERT INTO sleep_records (user_id, logical_sleep_date, source, started_at, ended_at, dream_key)
     SELECT user_id, logical_sleep_date::date, 'app', sleep_started_at, wake_at, $3
     FROM daily_states WHERE user_id = $1 AND logical_sleep_date = $2::date`,
    [user.id, logicalSleepDate, dreamKey],
  );

  const stardustBalance = await grantStardust(pool, user.id, logicalSleepDate, STARDUST_FOR_UNBOX, 'unbox');

  res.json({
    logicalSleepDate,
    dreamKey,
    dreamName: DREAM_COPY[dreamKey].name,
    memoryLine,
    worldTier: newTier,
    worldGrowthValue: newGrowth,
    stardustBalance,
  });
});

if (isMainModule()) {
  app.listen(PORT, () => {
    console.log(`Goodnight Planet API listening on :${PORT}`);
    console.log(`  Swagger UI    : http://localhost:${PORT}/docs`);
    console.log(`  OpenAPI YAML  : http://localhost:${PORT}/openapi.yaml`);
    console.log(`  OpenAPI JSON  : http://localhost:${PORT}/openapi.json`);
  });
}




