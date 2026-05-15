-- Slice: 首屏「儀式完成度」— 倒數 ✓ 與 按了睡 ✓ 分欄（對齊 MVP §7.2、02_UI_FLOW）

ALTER TABLE daily_states
  ADD COLUMN IF NOT EXISTS ritual_countdown_completed BOOLEAN NOT NULL DEFAULT false;

UPDATE daily_states
SET ritual_countdown_completed = true
WHERE ritual_countdown_done = true OR sleep_started_at IS NOT NULL;
