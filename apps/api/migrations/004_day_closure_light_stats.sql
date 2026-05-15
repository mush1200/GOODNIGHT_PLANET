-- §六 可選「今天結束儀式」；與 daily_states.logical_sleep_date 同鍵（MVP checklist 2.5.3）

ALTER TABLE daily_states
  ADD COLUMN IF NOT EXISTS day_closure_completed BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS day_closure_skipped BOOLEAN NOT NULL DEFAULT false;
