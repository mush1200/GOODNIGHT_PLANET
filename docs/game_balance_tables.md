# Goodnight Planet｜Game Design Rule Tables（平衡表）v0.2

| 項目 | 說明 |
| ---- | ---- |
| 對齊規格 | MVP **v1.5.6** |
| 狀態 | **草案**：數值由 PD／營運迭代；**程式與企劃只由此檔與 seed 對齊** |

**🔥 對使用者展示：** 表中 `rarity`／weight **不得**直接做成 SSR／圖鑑 UI；**敘事化標籤**見 `art_direction.md` §4、`tone_of_voice.md` §8。

本檔解決 **night_sky → forecast → drops → collectibles → world_growth → background** 高度耦合卻 oral 修改的問題。  
**禁止**：在 Slack 口頭改機率而不更新本檔與 migration／seed。

---

## 1. 全域常數

| 常數 | 預設 | 說明 |
| ---- | ------ | ---- |
| `SLEEP_ROLLOVER_HOUR` | 5 | 與 `logical_sleep_date` 一致 |
| `VERTICAL_SLICE_NIGHT_SKIES` | 3 | MVP 夜空種類上限（可再加） |
| `VERTICAL_SLICE_DREAM_TYPES` | 5 | MVP 夢類型上限 |
| `WORLD_TIER_CAP_MVP` | 4 | MVP 最大階（第 4 階可標 Launch） |

---

## 2. night_sky（夜空狀態）

| key | display_name | rarity | bg_asset_id | forecast_summary |
| --- | -------------- | ------ | ------------- | ------------------ |
| `clear_star` | 星光清楚 | common | `bg_clear_star` | 今晚星星很靠近 |
| `soft_rain` | 細雨綿綿 | uncommon | `bg_soft_rain` | 雲層把腳步放輕了 |
| `blue_moon` | 偏藍月光 | rare | `bg_blue_moon` | 月亮今晚偏藍一點 |

*Launch 可追加列，勿改 key 語意。*

---

## 3. forecast（今夜夜空如何決定）

| 規則 ID | 條件 | 結果 night_sky key |
| ------- | ---- | ------------------ |
| R1 | `nights_completed == 0`（第 1 晚） | `clear_star`（固定教學感） |
| R2 | `nights_completed < 7` | 累計權重：`clear_star` **0.55** → `soft_rain` **0.35** → `blue_moon` **0.10** |
| R3 | `nights_completed >= 7` | 均勻三段：`clear_star` **0.33** / `soft_rain` **0.33** / `blue_moon` **0.34**（勿賭博感） |

**實作備註：** 每日 **每使用者** 結算 **一次** `night_sky`，寫入 `daily_states.night_sky_state_key`；程式入口為 `rollNightSky({ nightsCompleted, random })`（`apps/api/src/balance.ts`）。

---

## 4. drops（開箱掉落）

**夢類型 slug 表（MVP 5 種示例）：**

| dream_key | name | weight_clear_star | weight_soft_rain | weight_blue_moon |
| --------- | ---- | ------------------- | ---------------- | ---------------- |
| `rain_city` | 雨天夢 | 0.2 | 0.5 | 0.1 |
| `star_path` | 星光夢 | 0.5 | 0.2 | 0.3 |
| `train_whisper` | 列車囈語 | 0.2 | 0.2 | 0.2 |
| `lake_mirror` | 湖光夢 | 0.05 | 0.08 | 0.25 |
| `aurora_hint` | 極光預感 | 0.05 | 0.02 | 0.15 |

**早睡限定（§5.19）：** 若 `early_bed == true`，將 `aurora_hint` weight **×** `EARLY_BED_AURORA_MULTIPLIER`（**1.5**，程式常數，僅作用於固定 `DROP_WEIGHTS`，**不依賴**季節池）。

---

## 5. growth（世界成長值）

| 事件 | growth_delta | 程式錨點 |
| ---- | ------------- | -------- |
| `sleep_start`（按下「我要睡了」） | **+10** | `index.ts: app.post('/v1/sleep/start')` |
| `sleep_wake`（起床標記） | **+5** | `index.ts: app.post('/v1/sleep/wake')` |
| `unbox`（晚安開箱完成） | **+25** | `index.ts: app.post('/v1/unbox')` |
| `cancel_sleep`（僅 start 撤銷） | **−10** | 同 sleep_start 之回退 |
| `cancel_sleep`（已 wake 再撤銷） | **−15** | start +10 + wake +5 全退 |

**升階閾值（MVP 4 階，與 `apps/api/src/balance.ts` `TIER_THRESHOLDS` 同步）：**

| tier | cumulative_growth_min | 備註 |
| ---- | --------------------- | ---- |
| 1 | **0** | 新手 |
| 2 | **40** | 對齊 §4.8 第 3 天感受錨（完成 1～2 夜可進） |
| 3 | **120** | 對齊 §4.8 第 14 天升階 |
| 4 | **280** | MVP 最高階（可標 Launch） |

> 若 §4.8 節奏標靶 **實測太慢**：**只調整本表 delta 與閾值**，不新增系統；同步更新 `balance.ts` 與 `balance.test.ts`、`rhythmMilestones.test.ts`。

---

## 6. streak（連勝）與 moon_guard

| 規則 | 說明 |
| ---- | ---- |
| 合格定義 | 綁 `logical_sleep_date` + `on_time`（細節見主規格） |
| moon_guard | 每曆週 **1** 次（待定）；觸發時 **不扣連勝**，文案走寵物敘事 |

---

## 7. world_attunement（牽掛／蔫）

| 規則 ID | 條件 | 視覺 |
| ------- | ---- | ---- |
| W1 | `days_since_last_open > N1` | 植物蔫、燈光稍暗 |
| W2 | 使用者完成任一晚安儀式 | 恢復預設 |

| 常數 | MVP 值 | 說明 |
| ---- | ------ | ---- |
| **N1** | **3** | `days_since_last_open` 為 **邏輯日差**（`last_open_at` 與 `now` 各自映射之 `logical_sleep_date`）；**嚴格大於** N1 觸發 W1。程式常數：`WORLD_ATTUNEMENT_WILT_EXCLUSIVE_THRESHOLD`。 |

**禁止：** 數值羞辱 copy（見 `tone_of_voice.md`）。

---

## 8. stardust（星塵 ledger，MVP）

| reason（`stardust_ledger.reason`） | delta | 說明 |
| ---------------------------------- | ----- | ---- |
| `ritual_countdown_complete` | **+1** | 完成 30s 倒數標記（與儀式進度一致） |
| `sleep_start` | **+3** | 按下「我要睡了」 |
| `sleep_wake` | **+1** | 起床標記 |
| `unbox` | **+10** | 開箱／記憶冊結算 |
| `cancel_sleep` | **−3** 或 **−4** | 撤銷當晚入睡：僅 start 撤 **−3**；已 wake 再撤 **−4**（與成長回退 10／15 對齊） |

**餘額：** `users.stardust_balance` 為累加；寫入必伴隨 `stardust_ledger` 列。程式常數見 `apps/api/src/stardust.ts`。

---

## 9. 修訂紀錄

| 版本 | 日期 | 摘要 |
| ---- | ---- | ---- |
| v0.1 | 2026-05-12 | 初稿框架，對齊 v1.5 Vertical Slice |
| v0.2 | 2026-05-13 | §3 forecast 權重補實作值；§5 growth delta、tier 閾值對齊 `balance.ts`（[0, 40, 120, 280]）；§2 `bg_asset_id` 定稿（`bg_clear_star`／`bg_soft_rain`／`bg_blue_moon`） |
