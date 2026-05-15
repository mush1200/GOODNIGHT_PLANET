# 領域／名詞表 + 權限（Vertical Slice）

與 `contracts/openapi.yaml`、`02_UI_FLOW.md`、畫面用語一致；**Slice 僅裝置識別**，無帳密角色。

## 名詞（中英對齊 API / DB）

| 對外／UI | API / 程式 | DB / 說明 |
| -------- | ---------- | --------- |
| 邏輯睡眠日 | `logicalSleepDate` | `daily_states.logical_sleep_date` — 見 `logicalDate.ts`、平衡表日界 |
| 今夜夜空 | `nightSky` | `night_sky_definitions` + 當日 `daily_states.night_sky_state_key` |
| Forecast 摘要 | `forecastSummary` | 夜空定義欄位，非氣象 API |
| 敘事稀有標籤 | `rarityNarrativeTag` | 由 `rarity` 映射敘事句；**禁止** SSR／UR／圖鑑編號 |
| 晚安一句話 | `goodnightLine` | 人輪替短句，非長文本系統 |
| 儀式倒數完成 | `ritualCountdownCompleted` | `daily_states.ritual_countdown_completed` |
| 已按下我要睡了 | `sleepStarted` | `daily_states.sleep_started_at` 非空 |
| 入睡中（可開箱前） | `sleeping` | 有 `sleep_started_at` 且當日未 `unboxed` |
| 已開箱 | `unboxed` | `daily_states.unboxed` |
| 夢類型鍵 | `dreamKey` | 平衡表 5 種之一；記憶冊後端權重用 |
| 夢名（敘事） | `dreamName` | 展示用，非圖鑑名 |
| 記憶句 | `memoryLine` | `memory_entries.narrative` |
| 世界階 | `worldTier` | `users.world_tier`（1–4，Slice 驗證至 3–4） |
| 成長值 | `worldGrowthValue` | `users.world_growth_value` |
| 連勝天數 | `streakDays` | `users.streak_days`（錨 `last_completed_logical_date`） |

## 權限（Slice）

| 主體 | 能做什麼 | 備註 |
| ---- | -------- | ---- |
| 持有有效 `x-device-id` 的 App | `GET /v1/today`、`POST` 儀式／睡眠／起床／開箱 | 裝置即使用者；`bootstrap` 建立 user + 預設寵 |
| 無／未知裝置 | 僅 `GET /health`、`POST /v1/bootstrap` | `401 missing_or_unknown_device` |
| 後台／營運 | **未納入 Slice** | 夜空定義以 migration seed 為準 |

## 狀態轉移（對齊 UX）

`開始儀式`（僅前端）→ 倒數結束 → `POST /v1/ritual/countdown-complete` → `POST /v1/sleep/start` → `sleeping` → `POST /v1/sleep/wake` → `POST /v1/unbox` → 記憶冊／世界畫面。

取消儀式返回首屏：不寫後端；**不**使用 guilt 文案（`tone_of_voice.md` §5.1）。

## 手動補登（Launch 外）

- **`POST /v1/sleep/manual-record`**：整合測與 OpenAPI 已覆蓋；**App 無入口**（`deviceMigration.ts` 之 `MANUAL_SLEEP_RECORD_LAUNCH_EXCLUDED`）。
- 用途：營運／除錯或 Launch 後補登旅程；**不**取代主晚安儀式路徑。

## 換機／多裝置（Launch 前）

- **Slice 身分**：`AsyncStorage` 的 `gp_device_v1` 即 `x-device-id`；`bootstrap` 只建立或解析該裝置的使用者。
- **備份**：每次啟動會把現行 `gp_device_v1` 複寫到 `gp_device_backup_v1`（見 `apps/mobile/src/deviceMigration.ts`）。
- **還原**：設定頁「還原此裝置備份」會把備份寫回 `gp_device_v1` 並重新 `bootstrap`／同步離線佇列；**不**合併兩台裝置進度。
- **換機**：新機安裝後若無備份，會產生新 `deviceId` 與新使用者；舊機資料仍留在舊 `deviceId` 綁定的使用者上，直到 Launch 帳號系統取代裝置鍵。
