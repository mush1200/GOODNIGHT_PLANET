-- Seed night skies & placeholder tiers — tune via game_balance_tables.md

INSERT INTO night_sky_definitions (key, display_name, rarity, forecast_summary)
VALUES
  ('clear_star', '星光清楚', 'common', '今晚星星很靠近'),
  ('soft_rain', '細雨綿綿', 'uncommon', '雲層把腳步放輕了'),
  ('blue_moon', '偏藍月光', 'rare', '月亮今晚偏藍一點')
ON CONFLICT (key) DO NOTHING;
