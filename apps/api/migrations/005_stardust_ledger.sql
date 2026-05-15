-- §十 stardust_ledger + users.stardust_balance（checklist 2.7.1）

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS stardust_balance INT NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS stardust_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  logical_sleep_date DATE,
  delta INT NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS stardust_ledger_user_created ON stardust_ledger(user_id, created_at DESC);
