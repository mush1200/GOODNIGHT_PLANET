-- Goodnight Planet — initial schema (Vertical Slice)
-- Align with GOODNIGHT_PLANET_MVP_SPEC §十 & game_balance_tables.md

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_open_at TIMESTAMPTZ,
  streak_days INT NOT NULL DEFAULT 0,
  world_growth_value INT NOT NULL DEFAULT 0,
  world_tier INT NOT NULL DEFAULT 1 CHECK (world_tier >= 1 AND world_tier <= 4),
  nights_completed INT NOT NULL DEFAULT 0,
  last_completed_logical_date DATE
);

CREATE TABLE pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  archetype TEXT NOT NULL DEFAULT 'gentle',
  display_name TEXT NOT NULL DEFAULT '小燈'
);

CREATE UNIQUE INDEX pets_one_per_user ON pets(user_id);

CREATE TABLE night_sky_definitions (
  key TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  rarity TEXT NOT NULL,
  forecast_summary TEXT NOT NULL
);

CREATE TABLE daily_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  logical_sleep_date DATE NOT NULL,
  night_sky_state_key TEXT NOT NULL REFERENCES night_sky_definitions(key),
  ritual_countdown_done BOOLEAN NOT NULL DEFAULT false,
  sleep_started_at TIMESTAMPTZ,
  wake_at TIMESTAMPTZ,
  unboxed BOOLEAN NOT NULL DEFAULT false,
  UNIQUE (user_id, logical_sleep_date)
);

CREATE INDEX daily_states_user_date ON daily_states(user_id, logical_sleep_date);

CREATE TABLE sleep_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  logical_sleep_date DATE NOT NULL,
  source TEXT NOT NULL DEFAULT 'app',
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  dream_key TEXT
);

CREATE TABLE memory_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  logical_sleep_date DATE NOT NULL,
  dream_key TEXT NOT NULL,
  night_sky_key TEXT NOT NULL,
  narrative TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
