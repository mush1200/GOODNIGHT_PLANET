-- Moon guard (§5.16)、睡眠時間 §5.1、早睡標記 §5.11／2.8.4

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS target_sleep_time_local TEXT,
  ADD COLUMN IF NOT EXISTS wake_time_local TEXT,
  ADD COLUMN IF NOT EXISTS push_reminder_enabled BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS moon_guard_usage (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  iso_week TEXT NOT NULL,
  uses INT NOT NULL DEFAULT 0 CHECK (uses >= 0 AND uses <= 1),
  PRIMARY KEY (user_id, iso_week)
);

ALTER TABLE daily_states
  ADD COLUMN IF NOT EXISTS early_bed_for_dream BOOLEAN NOT NULL DEFAULT false;
