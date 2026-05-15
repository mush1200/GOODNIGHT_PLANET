# Goodnight Planet MVP｜開發 Checklist（對齊規格 v1.5.11）

依 [`GOODNIGHT_PLANET_MVP_SPEC.md`](./GOODNIGHT_PLANET_MVP_SPEC.md) 範圍列出須交付項目；**§1～§4** 為 **可用產品** 必做；**§7** 為 **可用→專業加分**（§0.6），**不** 與 §1～§4 混勾；**§8** 為 **前端 UI 深化**（§0.6.1），須 **§7 全勾** 後始納入排程，**不** 與 §7 混勾；**§9** 為 **前後端接軌稽核後續**（§0.6.2），須 **§1～§8 現況** 為前提，**不** 與 §7／§8 混勾、**不** 回溯改寫 §1～§8 已勾敘事；**§10** 為 **睡前首屏 IA 收斂**（§7.3），須 **§9 現況** 為前提；**§11** 為 **情緒節奏與聲音人格**（§7.4），須 **§10 現況** 為前提，**不** 新增 §0.4 系統級模組；**§12** 為 **Launch RC 與上架前**（§0.6.3），須 **§11 現況** 為前提，**不** 與 §1～§11 混勾、**不** 新增 §0.4 系統級模組；**§13** 為 **檢核收斂與後續邊界**（§0.7），**不打勾**、**不** 新增測試閘門。並依規格書 **「文件導讀」** 與 **附錄 B** 說明，**一併查閱同資料夾 `docs/`**（本機常見路徑：`C:\GOODNIGHT_PLANET\docs`）**內其他支援文件**（如 UX／UI 流程、Figma 範圍、網域權限、世界觀 Bible 等），避免僅對照本檢核表與單一規格書而漏項。**打勾規則（強制）**：該列「測試閘門」所列測試須全部通過（終端機呈現綠燈／`vitest` exit code 0）；若該列寫「（待補測試）」，須先新增對應測試檔並全綠後，才可勾選該項。後端或 UI **已實作但未寫斷言**者，仍以「補齊測試並全綠」為打勾條件，避免誤勾。**§12.2** 內測 JSON **不** 等同真機連續一週實測；語意見規格 **§0.7**、本檔 **§13**。

---

## 0. 驗證指令（全綠定義）

在專案根目錄或 `apps/api`：

```bash
cd apps/api
npm run test
```

```bash
cd apps/mobile
npm run test
```

`npm run test` 會先跑 **vitest**（`src/**/*.test.ts`）再跑 **jest-expo**（`src/**/*.test.tsx`；`@testing-library/react-native` render 斷言）。兩者皆須 exit code 0。

| 測試檔 | 內容摘要 |
| ------ | -------- |
| `test/logicalDate.test.ts` | `logical_sleep_date` 日界、`SLEEP_ROLLOVER_HOUR`、跨日運算 |
| `test/balance.test.ts` | 夜空權重、夢掉落（**5×3** 掉落表加總）、世界階 `tierFromGrowth`／進度、稀有度敘事化 tag 且 **禁 SSR／UR／圖鑑式字串**（§八） |
| `test/goodnightLines.test.ts` | 晚安句庫大小、決定性輪替（checklist 1.6） |
| `test/balanceSeed.test.ts` | `NIGHT_SKY_DEFINITION_SSOT` 與 `DROP_WEIGHTS`／`game_balance_tables.md` 鍵與 forecast 契約 |
| `test/api.integration.test.ts` | HTTP 垂直切片：`bootstrap` → `today`（含 `onboardingPhase`、`homeDockHint`、`moonGuard*`、睡眠排程、**worldAttunement**、**stardustBalance** 等）→ 儀式 → `sleep` → `wake` → `unbox`；`cancel`；`day-closure`；`moon-guard`；`PATCH /v1/me/sleep-schedule`；`daily/early-bed`；`push/template-goodnight`、`push/reminder-preview`。**需**設定 `DATABASE_URL`；未設定時此檔會 **skip**，**不視為** MVP 驗收通過。 |
| `test/schemaSnapshot.test.ts` | DB schema 快照（§十／checklist 3.1）：users／pets／daily_states／sleep_records／memory_entries／stardust_ledger／moon_guard_usage 欄位與 nullability、night_sky 三鍵 seed、`daily_states (user_id, logical_sleep_date)` UNIQUE。**需** `DATABASE_URL`；未設定時 skip。 |
| `test/templateGoodnight.test.ts` | 推播／系統短模板：長度與 §八 禁字、語氣黑名單、與 `goodnightLines` 池分離、`pushEmotionalState` × 四原型（checklist **2.5.5**、**11.2.2**） |
| `test/pushEmotionalState.test.ts` | 推播情緒狀態推導（checklist **11.2.1**） |
| `test/worldAttunement.test.ts` | 可逆牽掛：`logicalDaysSinceLastOpen`、`worldAttunementState`、N1 與 `game_balance_tables.md` §7（checklist **2.6.2**） |
| `test/moonGuardWeek.test.ts` | 月亮守護 ISO 週鍵（§6；checklist **2.8.1**） |
| `test/onboarding.test.ts` | 新手期階段（**2.8.2**） |
| `test/homeDockHint.test.ts` | 小屋開屏提示、禁 guilt（**2.8.3**） |
| `test/earlyBedDream.test.ts` | 早睡權重僅固定表、倍率對齊 balance（**2.8.4**） |
| `test/sleepSchedule.test.ts` | 就寢／起床 HH:mm 與目標時長（**2.9.1**） |
| `test/mockPush.test.ts` | 推播 mock payload（**2.9.2**） |
| `test/rhythmMilestones.test.ts` | §4.8 節奏錨（首晚夜空等）（**4.3**） |
| `test/marketingCopy.test.ts` | `docs/store_copy.md` 行銷禁字（**4.2**） |
| `test/toneCompliance.test.ts` | 使用者可見字串語氣黑名單（**4.4**） |
| `apps/mobile` `npm run test` | **vitest**：`ritualProgress`／`progressCopy`／`progressLayout`（**2.10.1**／**2.10.2**）；`pickContextualLine`／`postRitualDreamLine`／`nightSoundPreferences`（**v1.5.11** 體感收斂）；**§11**：`emotionalPacing.test.ts`、`soundProfile.test.ts`、`nightSoundscapePlayback.test.ts`、`reminderSoundProfile.test.ts`、`humanSleepValidation.test.ts`、`push/pushEmotionalState.test.ts`（與 `push/reminders.test.ts` 擴充）。**§12**：`launchMetrics.test.ts`、`launchRcAcceptance.test.ts`、`assets/visualAssetManifest.test.ts`、`assets/soundPackMount.test.ts`。**jest-expo**：`TonightProgressPanel.test.tsx`（`@testing-library/react-native` render；`describe.each` **ios**／**android**；`testID` 與首頁進度面板一致，供 Expo Go 手動驗收對照）；**§11**：`uiPrimitives.test.tsx`（`RitualTimer` 末段空 hint）、`SleepSettingsScreen.test.tsx`（**聲音**／**夜晚聲音** Switch） |

**最近一次正式 release 驗收重跑（請於每次 release 前更新此段日期與結果）：** 2026-05-15 — **Node** `v22.22.0`（≥20.19.4）；`apps/api` `npm run test` **87** 項全通過（含 `schemaSnapshot.test.ts` 10 項，需 `DATABASE_URL`）；`apps/mobile` `npm run test` **131** 項全通過（vitest **100** ＋ jest **31**）；`apps/api` `npm run build`（`tsc`）通過。若未設定 **`DATABASE_URL`**，`api.integration.test.ts` 與 `schemaSnapshot.test.ts` 會 **skip**，依本檔打勾規則 **不視為** MVP 驗收通過。**現行 migrations**：001～006（004 day_closure light stats／005 stardust_ledger／006 moon_sleep_early；新環境請依序執行）。**規格／合約版本**：`GOODNIGHT_PLANET_MVP_SPEC.md` v1.5.11、`contracts/openapi.yaml` v0.2（17 端點）、`game_balance_tables.md` v0.2（§2 `bg_asset_id` 已定稿）、`sound_asset_policy.md` v0.1。**§1～§12** 已全勾；**§13** 為檢核外後續邊界（**不打勾**），見規格 **§0.7**。**v1.5.11** 體感收斂（聲音雙開關、首屏 ambience、情境句優先序、儀式後單句回饋、進度階梯僅展示 1～3）**不** 另開新勾選列；**首屏減法** 仍列 **§12.5** 刻意排除、**未** 納入本輪。

---

## 1. Vertical Slice（§0.5、§十三 順序 0）

| 勾選 | 項目 | 規格錨點 | 測試閘門 |
| --- | --- | --- | --- |
| [x] | **1.1** 單寵＋單一人格原型（含預設名／原型欄位） | §0.5、§0.2 #2、§3.3、`pets` | `api.integration.test.ts`（`bootstrap` 回傳 `petName`、`petArchetype`） |
| [x] | **1.2** 夜空 **3** 種 variant，且耦合規則可驗證 | §0.5、§5.14、§9.2 | `balance.test.ts`（`rollNightSky`）＋ `api.integration.test.ts`（`nightSky.key` 限定三種） |
| [x] | **1.3** 夢類型 **5** 種（記憶冊／掉落表） | §0.5、§5.6～5.10 | `balance.test.ts`（`rollDream`／`DROP_WEIGHTS`）＋ `api.integration.test.ts`（開箱有 `dreamKey`） |
| [x] | **1.4** 世界階梯 **3～4** 階（數值與進度可驗） | §0.5、§5.12 | `balance.test.ts`（`tierFromGrowth`、`progressInTier`） |
| [x] | **1.5** 一晚安循環可跑完（儀式→睡→醒→開箱→成長／連勝寫入） | §0.5、§六流程 | `api.integration.test.ts`（`full night flow`） |
| [x] | **1.6** 人格晚安句庫 **≥10** 句可輪替（或同等後端策略） | §0.5、§5.20 | `goodnightLines.test.ts` |

---

## 2. MVP 必做模組（§0.2 對照表）

### 2.1 底層與日界

| 勾選 | 項目 | 規格錨點 | 測試閘門 |
| --- | --- | --- | --- |
| [x] | **2.1.1** `logical_sleep_date` 全鏈路（結算、連勝、日狀態鍵） | §0.2 #7、§4.6、§5.4 | `logicalDate.test.ts` ＋ `api.integration.test.ts`（`today` 回傳日期格式） |
| [x] | **2.1.2** `sleep_records.source` 與補登語意（手動／`app` 等） | §5.4 | `api.integration.test.ts`（`POST /v1/sleep/manual-record`） |

### 2.2 晚安儀式（核心路徑）

| 勾選 | 項目 | 規格錨點 | 測試閘門 |
| --- | --- | --- | --- |
| [x] | **2.2.1** 30 秒倒數完成可標記；**禁止**僅靠背景自動判睡 | §0.2 #1、§5.3 | `api.integration.test.ts`（`ritual/countdown-complete`） |
| [x] | **2.2.2** `start_sleep`／`sleeping` 狀態與「我要睡了」後一致 | §3、§5.3 | `api.integration.test.ts`（`sleep/start`、`today.sleeping`） |
| [x] | **2.2.3** `cancel_sleep`：離開流程、狀態回復、柔性錯誤契約 | §5.3、§5.20、`tone_of_voice.md`（柔性文案） | `api.integration.test.ts`（`POST /v1/sleep/cancel`；回應 `message` 黑名單：失敗／活該／丟臉） |

### 2.3 今夜夜空＋ Forecast

| 勾選 | 項目 | 規格錨點 | 測試閘門 |
| --- | --- | --- | --- |
| [x] | **2.3.1** `night_sky` → forecast 文案／欄位與 DB seed 對齊 `game_balance_tables.md` | §5.14、§9.2、附錄 B | `balanceSeed.test.ts` ＋ `api.integration.test.ts`（DB 與 `NIGHT_SKY_DEFINITION_SSOT` 全等） |
| [x] | **2.3.2** 今夜夜空 **敘事 tag**（前端禁 SSR／UR；後端敘事化輸出） | §7.2、§八 | `balance.test.ts`（`rarityNarrativeTag`、§八禁字）＋ `api.integration.test.ts`（`GET /v1/today`：`rarityNarrativeTag`／`forecastSummary`） |

### 2.4 晚安一句話

| 勾選 | 項目 | 規格錨點 | 測試閘門 |
| --- | --- | --- | --- |
| [x] | **2.4.1** 每晚一句、人格化輪替（非長文本系統） | §0.2 #8、§5.20 | `api.integration.test.ts`（`goodnightLine`）＋ **1.6** |

### 2.5 晚安開箱 × 記憶冊

| 勾選 | 項目 | 規格錨點 | 測試閘門 |
| --- | --- | --- | --- |
| [x] | **2.5.1** 起床後開箱、記憶冊敘事（禁圖鑑編號式） | §0.2 #4、§八 | `api.integration.test.ts`（`memoryLine` 含「今晚記住了」、重複開箱 `already_unboxed`） |
| [x] | **2.5.2** `memory_entries` 寫入與查詢 API（若規格需列表頁資料） | §5.6～5.10 | `api.integration.test.ts`（`GET /v1/memory-entries`） |
| [x] | **2.5.3** **今天結束儀式**（§六可選路徑：與主晚安流銜接、不強制自動入睡） | §5.6～5.10、§六 | `api.integration.test.ts`（`POST /v1/ritual/day-closure`；`daily_states` 綁當日 `logical_sleep_date`；不阻擋 `sleep/start`） |
| [x] | **2.5.4** **輕統計**（連勝、最近入睡日等摘要；非報表主軸） | §1.2、§5.6～5.10 | `api.integration.test.ts`（`GET /v1/today`：`nightsCompleted`、`lastCompletedLogicalDate`、`lastSleepLogicalDate`；手動補登後 `lastSleepLogicalDate`） |
| [x] | **2.5.5** **模板晚安**（推播／系統佔位文案與句庫分離；`pushEmotionalState` × 四原型） | §5.6～5.10、§5.7 | `templateGoodnight.test.ts` ＋ `api.integration.test.ts`（`GET /v1/push/template-goodnight`） |

### 2.6 世界成長（含可逆牽掛）

| 勾選 | 項目 | 規格錨點 | 測試閘門 |
| --- | --- | --- | --- |
| [x] | **2.6.1** `world_growth_value`／階梯與 API 暴露之進度欄位 | §5.12、§7.2 | `balance.test.ts` ＋ `api.integration.test.ts`（`worldTier`、`worldGrowthValue`、`worldProgressFraction`） |
| [x] | **2.6.2** 可逆牽掛：`last_active_logical_date`／`users.last_open_at`（或等價欄位）驅動「蔫／恢復」規則與文案閘 | §5.12、§2.7 | `worldAttunement.test.ts`（N1、W1／W2）＋ `api.integration.test.ts`（`GET /v1/today`：`worldAttunement`、`daysSinceLastOpenLogical`、`attunementHint`） |

### 2.7 星塵 ledger

| 勾選 | 項目 | 規格錨點 | 測試閘門 |
| --- | --- | --- | --- |
| [x] | **2.7.1** 星塵變動寫入 `stardust_ledger`、與儀式／開箱等事件一致 | §5.6、§十 | `stardust.test.ts` ＋ `api.integration.test.ts`（ledger 加總、`cancel_sleep` 後餘額） |

### 2.8 月亮守護與 §5.16～5.19 其餘保留項

| 勾選 | 項目 | 規格錨點 | 測試閘門 |
| --- | --- | --- | --- |
| [x] | **2.8.1** 月亮守護次數／冷卻與 API | §5.16～5.19 | `moonGuardWeek.test.ts` ＋ `api.integration.test.ts`（`moon-guard/status`、`trigger`） |
| [x] | **2.8.2** **新手期**（首次晚安／首週引導與節奏門檻，不增新系統） | §5.16～5.19 | `onboarding.test.ts` ＋ `api.integration.test.ts`（`GET /v1/today`：`onboardingPhase`） |
| [x] | **2.8.3** **小屋等你／想念敘事**（開屏、推播或 `today` 提示；禁 guilt、對齊可逆牽掛） | §5.16～5.19、§2.7 | `homeDockHint.test.ts` ＋ `api.integration.test.ts`（`homeDockHint`） |
| [x] | **2.8.4** **早睡限定**（固定條目或權重；**不得依賴**季節夢境池） | §5.16～5.19、§5.11 | `earlyBedDream.test.ts` ＋ `api.integration.test.ts`（`POST /v1/daily/early-bed`） |

### 2.9 睡眠時間設定與提醒（輕量 MVP）

| 勾選 | 項目 | 規格錨點 | 測試閘門 |
| --- | --- | --- | --- |
| [x] | **2.9.1** `target_sleep_time`／`wake_time` 儲存與後端推算目標時長 | §5.1 | `sleepSchedule.test.ts` ＋ `api.integration.test.ts`（`PATCH /v1/me/sleep-schedule`、`today.targetSleepDurationMinutes`） |
| [x] | **2.9.2** 推播或 in-app 召回（最小可行；含 `title`／`pushEmotionalState` mock payload） | §5.2 | `mockPush.test.ts` ＋ `api.integration.test.ts`（`GET /v1/push/reminder-preview`） |

### 2.10 清晰進度 UI（App）

| 勾選 | 項目 | 規格錨點 | 測試閘門 |
| --- | --- | --- | --- |
| [x] | **2.10.1** 今晚儀式完成度、連勝數字、世界進度（**展開** 階梯 **1～3**；後端可達第 4 階）、今夜夜空敘事 | §0.2 #9、§7.2、§5.12 | `apps/mobile` `ritualProgress.test.ts`／`progressLayout.test.ts` ＋ `TonightProgressPanel.test.tsx`（`VerticalSliceApp` 首頁面板；`testID` 與 Expo Go 對照） |
| [x] | **2.10.2** 寵物視覺／文案不觸 §八紅線（繪本癒感、非卡牌化） | §八、`art_direction.md` | `apps/mobile` `progressCopy.test.ts`（禁 SSR／UR／圖鑑式字串） |

---

## 3. 橫向：資料、遷移與規則 SSOT

| 勾選 | 項目 | 規格錨點 | 測試閘門 |
| --- | --- | --- | --- |
| [x] | **3.1** DB schema 與 §十一致（`users`、`pets`、`sleep_records`、`daily_states`、`memory_entries`、`night_sky_definitions`、`stardust_ledger`、`moon_guard_usage`…） | §十 | `npm run build`（`tsc`）＋ `schemaSnapshot.test.ts`（欄位／nullability／seed／UNIQUE）＋整合測試 |
| [x] | **3.3** **`contracts/openapi.yaml` v0.2** 與 `apps/api/src/index.ts` 路由清單一致（17 端點） | §9.3 | `api.integration.test.ts` 觸及所有端點；變動 OpenAPI 時同步本表與規格 §9.3 |
| [x] | **3.2** `game_balance_tables.md` v0 與 `balance.js`／seed／**星塵 §8** 同步 | §9.2、附錄 B | `balanceSeed.test.ts` ＋ `stardust.test.ts` ＋ `api.integration.test.ts`（DB） |

---

## 4. 非功能與上架預備（MVP 輕量）

| 勾選 | 項目 | 規格錨點 | 測試閘門 |
| --- | --- | --- | --- |
| [x] | **4.1** 健康檢查與部署就緒 | §十四（輕量） | `api.integration.test.ts`（`GET /health`） |
| [x] | **4.2** 商店／行銷文案用語符合 IP 定位（非醫療宣稱、非夢獸收集主標） | §八.4、§十四 | `marketingCopy.test.ts`（`docs/store_copy.md`） |
| [x] | **4.3** **§4.8 節奏標靶**（第 1／3／7／14／30 天「有感」；可憑數值／事件或內測驗收） | §4.8 | `rhythmMilestones.test.ts`（首晚夜空、成長階遞進） |
| [x] | **4.4** **`tone_of_voice.md`** 合規（使用者可見字串：儀式、`cancel_sleep`、錯誤、想念語氣；禁說教／羞恥） | §5.3、§5.12、§5.20、附錄 B | `toneCompliance.test.ts`（句庫／模板／取消文案／稀有度敘事） |

---

## 5. 明確排除（勿勾進 MVP）

| 項目 | 規格 |
| ---- | ---- |
| 微型故事系統（30s 連載文本管線等） | §0.3 |
| 季節夢境池／LiveOps 節奏 | §0.3 |
| NPC 訪客／夜晚居民剪影玩法 | §0.3 |
| 大量夢／夜空組合（先完成 Vertical Slice 再加量） | §0.3 |
| Health／AI／社交（§十二 非 MVP） | §十二（對照 §0.3 精神） |

---

## 6. Sprint 建議順序（僅參考，不打勾）

與規格 §十三 一致：先完成 **§0.5 Vertical Slice** 全部可自動驗證之測試閘門 → 再補 **2.1～2.5**（含 **2.5.3～2.5.5**）→ **2.10** 與 **2.6.2**、**2.7**、**2.8**（含 **2.8.2～2.8.4**）並行時須各自獨立測試檔全綠；**4.3**（節奏標靶）、**4.4**（語氣）建議與數值／文案迭代同 sprint 排入。**§1～§4 全綠後**，依規格 **§0.6** 單輪專業化建議：**7.1**（視覺）→ **7.2**（App 接線）→ **7.3**（可靠／時區）→ **7.4**（上架／CI）→ **7.5**（內容加深）；與 §十三 順序 **2** 並行時仍須各自測試閘門全綠。**§7 全勾後**，依 **§0.6.1** 排 **§8**。**§11 全勾後**，依 **§0.6.3** 排 **§12**。**§12 全勾後**，現行主軸為規格 **§0.7**／本檔 **§13**（真機／真人補強、§十三 順序 **3**）；**不** 回溯改寫 §1～§12 已勾敘事。排程與驗收時請併讀 **`docs/`** 內 UX／UI、設計範圍與權限文件，與規格書「文件導讀」對齊。

---

## 7. 可用 → 專業加分（§0.6；體感與投入比）

**範圍：** 在 **不新增** §0.4 系統級模組前提下，拉高體感、補齊 App 次要旅程與上架就緒。**§1～§4 全勾** 為進入本節之前提；本節 **不** 取代 MVP 必做打勾。

### 7.1 第一梯：體感最大（視覺與 IP 呈現）

| 勾選 | 項目 | 規格錨點 | 測試閘門 |
| --- | --- | --- | --- |
| [x] | **7.1.1** 三種 `night_sky` 背景／漸層落地（`bg_asset_id` 或等價資產） | §0.6 P1、§5.14、`game_balance_tables.md` §2 | `balanceSeed.test.ts`（三鍵）＋ `apps/mobile` `nightSkyTheme.test.ts`／`NightSkyBackdrop.test.tsx` |
| [x] | **7.1.2** 單寵繪本向視覺＋記憶冊小插圖位（禁圖鑑格／稀有度框） | §0.6 P2、§3.3、§5.10、`art_direction.md` §4 | `apps/mobile` `progressCopy.test.ts` ＋ `MemoryIllustration.test.tsx` |
| [x] | **7.1.3** 儀式／開箱／階梯 **慢動效**（呼吸、柔光；禁開卡金光） | §0.6 P3、`art_direction.md` §3 | `apps/mobile` `BreathingGlow.test.tsx` |
| [x] | **7.1.4** 可逆牽掛 **視覺**（`worldAttunement` 調 token／背景，非僅文案） | §0.6 P4、§4.7、§5.12、`game_balance_tables.md` §7 | `worldAttunement.test.ts` ＋ `apps/mobile` `attunementTheme.test.ts` |
| [x] | **7.1.5** 對齊 `04_FIGMA_SCOPE.md` 六屏與最小元件庫 | §0.6 P5、`02_UI_FLOW.md` | `TonightProgressPanel.test.tsx` ＋ `phaseNavigation.test.ts` |

### 7.2 第二梯：旅程完整度（後端已有、App 接線）

| 勾選 | 項目 | 規格錨點 | 測試閘門 |
| --- | --- | --- | --- |
| [x] | **7.2.1** 儀式離開已入睡時 `POST /v1/sleep/cancel` 與柔性 `message` | §0.6 J1、§5.3、§9.4 | `api.integration.test.ts`（`cancel`）＋ `apps/mobile` `cancelSleep.test.ts` |
| [x] | **7.2.2** `POST /v1/ritual/day-closure` 可選 UI | §0.6 J2、§5.9 | `api.integration.test.ts`（`day-closure`）＋ `apps/mobile` `dayClosure.test.ts` |
| [x] | **7.2.3** 月亮守護 `status`／`trigger` 敘事入口 | §0.6 J3、§5.16 | `moonGuardWeek.test.ts` ＋ `api.integration.test.ts` ＋ `MoonGuardScreen.test.tsx` |
| [x] | **7.2.4** 睡眠時間 `PATCH sleep-schedule`、早睡 `POST early-bed` 設定 UI | §0.6 J4、§5.1、§5.19 | `sleepSchedule.test.ts`、`earlyBedDream.test.ts` ＋ `api.integration.test.ts` ＋ `SleepSettingsScreen.test.tsx` |
| [x] | **7.2.5** `GET /v1/memory-entries` 記憶冊列表可翻閱 | §0.6 J5、§5.10 | `api.integration.test.ts`（`memory-entries`）＋ `MemoryArchiveScreen.test.tsx` |
| [x] | **7.2.6** 推播／in-app 召回接裝置（可先 Expo Notifications） | §0.6 J6、§5.2 | `mockPush.test.ts`、`templateGoodnight.test.ts` ＋ `api.integration.test.ts` ＋ `push/reminders.test.ts` |
| [x] | **7.2.7** `onboardingPhase` 與首屏文案對齊（含 `settled`）；首屏不暴露內部鍵名 | §0.6 J7、§5.17、§7.2 | `onboarding.test.ts` ＋ `onboardingCopy.test.ts` |

### 7.3 第三梯：可靠感與在地化

| 勾選 | 項目 | 規格錨點 | 測試閘門 |
| --- | --- | --- | --- |
| [x] | **7.3.1** 離線儀式＋同步佇列／重試；錯誤字串語氣合規 | §0.6 R1、`01_UX_FLOW.md`、§9.4 | `toneCompliance.test.ts` ＋ `offlineQueue.test.ts` |
| [x] | **7.3.2** `logical_sleep_date` 與使用者時區策略（如 `Asia/Taipei`） | §0.6 R2、§4.6 | `logicalDate.test.ts` ＋ `timezone.test.ts` |
| [x] | **7.3.3** OpenAPI 與 mobile client 型別同步（codegen 或共享型別） | §0.6 R3、§9.3、附錄 C | `api.integration.test.ts` ＋ `openapiContract.test.ts` |

### 7.4 第四梯：工程與上架

| 勾選 | 項目 | 規格錨點 | 測試閘門 |
| --- | --- | --- | --- |
| [x] | **7.4.1** CI：release 強制 api／mobile 測試全綠；整合測須 `DATABASE_URL` | §0.6 E1、本檔 §0 | `ciWorkflow.test.ts` |
| [x] | **7.4.2** 裝置 E2E：主路徑一晚安循環 | §0.6 E2、§0.5、§六 | `e2eFlow.test.ts`（Maestro `night-flow.yaml`） |
| [x] | **7.4.3** 商店五圖、隱私、資料說明；行銷過禁字 | §0.6 E3、§十四、§八.4 | `marketingCopy.test.ts` ＋ `storeAssets.test.ts` |
| [x] | **7.4.4** 換機／多裝置策略文件或實作（Launch） | §0.6 E4、`05_DOMAIN_AND_PERMISSIONS.md` | `deviceMigration.test.ts` |

### 7.5 第五梯：內容加深（§0.4 內迭代）

| 勾選 | 項目 | 規格錨點 | 測試閘門 |
| --- | --- | --- | --- |
| [x] | **7.5.1** 晚安句／夢／夜空在 Slice 上限內加量 | §0.6 C1、§0.5、§5.20 | `goodnightLines.test.ts`、`balance.test.ts` ＋ `contentBonus.test.ts` |
| [x] | **7.5.2** 第 4 階場景感；§4.8 偏慢時只調平衡表 | §0.6 C2、§4.8、`game_balance_tables.md` §5 | `rhythmMilestones.test.ts`、`balanceSeed.test.ts` |

---

## 8. 前端 UI 深化（§0.6.1；§7 後續加分）

**範圍：** 在 **不新增** §0.4 系統級模組前提下，將 §7 已達 **接線／最小視覺** 推向 **專業體感**（場景資產、繪本 IP、慢動效、次要旅程 IA、語氣化錯誤、上架截圖）。**§7 全勾** 為進入本節之前提；本節 **不** 取代 §7 打勾。

### 8.1 體感深化（§0.6 P1～P5 執行層）

| 勾選 | 項目 | 規格錨點 | 測試閘門 |
| --- | --- | --- | --- |
| [x] | **8.1.1** 三種 `night_sky` **真資產**（圖／Lottie；`bg_asset_id` 非僅漸層色） | §0.6.1 U-P1、§5.14、`game_balance_tables.md` §2 | `balanceSeed.test.ts`（三鍵）＋ `apps/mobile` `nightSkyAssets.test.ts`／`NightSkyBackdrop.test.tsx` |
| [x] | **8.1.2** 繪本 **寵物立繪**＋記憶／開箱 **依 `dreamKey`／`nightSkyKey` 換圖** | §0.6.1 U-P2、§3.3、§5.10、`art_direction.md` §4 | `progressCopy.test.ts` ＋ `MemoryIllustration.test.tsx` |
| [x] | **8.1.3** 開箱柔光、階梯亮起、六屏 **Stack 慢轉場**（禁開卡金光） | §0.6.1 U-P3、`art_direction.md` §3、`02_UI_FLOW.md` | `apps/mobile` `motionRegression.test.tsx` |
| [x] | **8.1.4** 可逆牽掛 **成套**（`attunementHint`、Tag、寵物與背景一致） | §0.6.1 U-P4、§4.7、§5.12、`game_balance_tables.md` §7 | `worldAttunement.test.ts` ＋ `apps/mobile` `AttunementKit.test.tsx` |
| [x] | **8.1.5** Figma **Tag／Timer／ProgressRing** 元件庫＋Expo Go 截圖對照 | §0.6.1 U-P5、`04_FIGMA_SCOPE.md` | `TonightProgressPanel.test.tsx` ＋ `apps/mobile` `uiPrimitives.test.tsx` |

### 8.2 旅程 UI 收斂（§0.6 J2～J7 體驗層）

| 勾選 | 項目 | 規格錨點 | 測試閘門 |
| --- | --- | --- | --- |
| [x] | **8.2.1** **今天收工**具儀式感（確認／回饋；非僅首屏 Ghost） | §0.6.1 U-J2、§5.9 | `api.integration.test.ts`（`day-closure`）＋ `apps/mobile` `DayClosureScreen.test.tsx` |
| [x] | **8.2.2** 月亮守護 **敘事入口**（週限視覺；非表單說明卡） | §0.6.1 U-J3、§5.16 | `moonGuardWeek.test.ts` ＋ `api.integration.test.ts` ＋ `MoonGuardScreen.test.tsx` |
| [x] | **8.2.3** 睡眠設定 **原生時間選擇**＋Forecast 關聯；推播開關與排程雙向 | §0.6.1 U-J4、§5.1、§5.19、§5.2 | `sleepSchedule.test.ts` ＋ `SleepSettingsScreen.test.tsx` |
| [x] | **8.2.4** 記憶冊列表含 **夢名／條目插圖** | §0.6.1 U-J5、§5.10 | `api.integration.test.ts`（`memory-entries`）＋ `MemoryArchiveScreen.test.tsx` |
| [x] | **8.2.5** in-app **推播預覽卡**；設定與 token／排程同步 | §0.6.1 U-J6、§5.2 | `mockPush.test.ts` ＋ `SleepSettingsScreen.test.tsx` |
| [x] | **8.2.6** 首屏 **寵物名**、新手強度、星塵等 **敘事化或收合** | §0.6.1 U-J7、§5.17、§7.2 | `onboarding.test.ts` ＋ `stardustNarrative.test.ts` |

### 8.3 可靠感 UX（§0.6 R1～R3 呈現層）

| 勾選 | 項目 | 規格錨點 | 測試閘門 |
| --- | --- | --- | --- |
| [x] | **8.3.1** 錯誤 **語氣化**（禁裸 `error` 碼）＋離線 **同步狀態列** | §0.6.1 U-R1、`01_UX_FLOW.md`、§9.4 | `toneCompliance.test.ts` ＋ `userFacingError.test.ts`／`reliableUx.test.tsx` |
| [x] | **8.3.2** 邏輯日 **日界 5:00**（`SLEEP_ROLLOVER_HOUR` 預設）與顯示策略一致（必要輕提示） | §0.6.1 U-R2、§4.6 | `logicalDate.test.ts` ＋ `reliableUx.test.tsx` |
| [x] | **8.3.3** OpenAPI 擴欄與 **畫面欄位**同 PR 同步 | §0.6.1 U-R3、§9.3 | `openapiContract.test.ts` ＋ `openapiFieldSync.test.ts` |

### 8.4 上架呈現（§0.6 E3 體感面）

| 勾選 | 項目 | 規格錨點 | 測試閘門 |
| --- | --- | --- | --- |
| [x] | **8.4.1** 商店五圖為 **真機截圖**（對齊六屏與 `store_copy.md`） | §0.6.1 U-E3、§十四、`art_direction.md` §5 | `marketingCopy.test.ts` ＋ `storeAssets.test.ts`／`storeScreenshots.test.ts` |

### 8.5 內容對應 UI（§0.6 C1～C2 呈現層）

| 勾選 | 項目 | 規格錨點 | 測試閘門 |
| --- | --- | --- | --- |
| [x] | **8.5.1** 句庫／夢／夜空加量後 **前端可辨輪播或微差視覺** | §0.6.1 U-C1、§0.5、§5.20 | `goodnightLines.test.ts`、`balance.test.ts` ＋ `contentVisual.test.ts` |
| [x] | **8.5.2** 第 4 階 **場景敘事**與世界畫面一致 | §0.6.1 U-C2、§4.8、`game_balance_tables.md` §5 | `rhythmMilestones.test.ts` ＋ `tierFourScene.test.tsx` |

---

## 9. 前後端接軌後續（§0.6.2；§1～§8 之後）

**範圍：** 2026-05-13 靜態稽核（`apps/api`、`apps/mobile`、`contracts/openapi.yaml`）所載 **契約錯位**、**已回傳未進 UI**、**日界／時區／儀式邊界**、**文件與測試深度** 之接軌與加深。**不** 新增 §0.4 系統級模組；**不** 取代 §1～§8 已勾項；**不** 與 §7／§8 混勾。細節表見 [`GOODNIGHT_PLANET_MVP_SPEC.md`](./GOODNIGHT_PLANET_MVP_SPEC.md) **§0.6.2**。

**建議優先序：** **9.1**（client 契約四項）→ **9.3**（邏輯日 SSOT）→ **9.2**／**9.4**／**9.5**／**9.6** 並行。

### 9.1 契約斷裂修復（高優先）

| 勾選 | 項目 | 規格錨點 | 測試閘門 |
| --- | --- | --- | --- |
| [x] | **9.1.1** 記憶冊：`GET /v1/memory-entries` 回應 **`items`** 與 `client.ts` 解析一致 | §5.10、§9.3、§0.6.2 | `api.integration.test.ts` ＋ `apps/mobile` `memoryEntriesContract.test.ts`（或等價；**禁**僅 `entries` 鍵） |
| [x] | **9.1.2** 今天收工：`POST /v1/ritual/day-closure` 送 **`{ action: 'complete' \| 'skip' }`** | §5.9、§0.6 J2、§0.6.2 | `api.integration.test.ts` ＋ `apps/mobile` `dayClosureContract.test.ts`（含 `complete` body；**禁**僅 `typeof postDayClosure`） |
| [x] | **9.1.3** 早睡：`POST /v1/daily/early-bed` 送 **`{ earlyBed: boolean }`** | §5.19、§0.6 J4、§0.6.2 | `earlyBedDream.test.ts` ＋ `api.integration.test.ts` ＋ `apps/mobile` `earlyBedContract.test.ts` |
| [x] | **9.1.4** 推播預覽：`GET /v1/push/reminder-preview` 帶 **`templateKey`** query | §5.2、§0.6 J6、§0.6.2 | `mockPush.test.ts` ＋ `api.integration.test.ts` ＋ `apps/mobile` `reminderPreviewContract.test.ts` |
| [x] | **9.1.5** 取消入睡：`CancelSleepResponse` 與 OpenAPI **`cancelled`／`message`** 對齊 | §5.3、§9.4、§0.6 J1 | `api.integration.test.ts` ＋ `apps/mobile` `cancelSleepContract.test.ts` |

### 9.2 後端已暴露、App 呈現或接線

| 勾選 | 項目 | 規格錨點 | 測試閘門 |
| --- | --- | --- | --- |
| [x] | **9.2.1** 輕統計：`nightsCompleted`、`lastCompletedLogicalDate`、`lastSleepLogicalDate` 進首屏或進度 UI | §5.8、checklist 2.5.4、§0.6.2 | `api.integration.test.ts` ＋ `apps/mobile` `lightStatsUi.test.ts`（或 `TonightProgressPanel` 擴充斷言） |
| [x] | **9.2.2** 睡眠設定顯示 **`targetSleepDurationMinutes`**（與 `PATCH sleep-schedule` 一致） | §5.1、§0.6 J4、§0.6.2 | `sleepSchedule.test.ts` ＋ `SleepSettingsScreen.test.tsx` |
| [x] | **9.2.3** 開箱後 **`unbox.stardustBalance`** 或同等回饋（非僅依賴 `today`） | §5.6、§0.6.2 | `stardust.test.ts` ＋ `api.integration.test.ts` ＋ `apps/mobile` `unboxStardust.test.ts`（待補） |
| [x] | **9.2.4** 收工 **`action: 'skip'`** 可選 UI 與 `dayClosureSkipped` 狀態 | §5.9、§0.6.2 | `api.integration.test.ts`（`skip`）＋ `apps/mobile` `dayClosureSkip.test.ts`（待補） |
| [x] | **9.2.5** **`GET /v1/push/template-goodnight`** 進設定或 in-app 預覽（與句庫分離） | §5.7、checklist 2.5.5、§0.6 J6 | `templateGoodnight.test.ts` ＋ `apps/mobile` `templateGoodnightUi.test.ts`（待補） |
| [x] | **9.2.6** **`POST /v1/sleep/manual-record`** App 入口或 Launch 外文件明確排除 | §5.4、checklist 2.1.2、§0.6.2 | `api.integration.test.ts` ＋ `deviceMigration.test.ts` 或產品說明錨點 |

### 9.3 邏輯日、時區、儀式邊界

| 勾選 | 項目 | 規格錨點 | 測試閘門 |
| --- | --- | --- | --- |
| [x] | **9.3.1** **`SLEEP_ROLLOVER_HOUR`、使用者時區、`LogicalDateHint`** 單一 SSOT（規格預設 5、§0.6.1 U-R2 與後端切片一致） | §4.6、§0.6 R2、§0.6.2 | `logicalDate.test.ts` ＋ `timezone.test.ts` ＋ `apps/mobile` `reliableUx.test.tsx` |
| [x] | **9.3.2** **`sleep/start`** 與 **`countdown-complete`** 邊界：未倒數完成不得等同儀式完成（或規格／實作明文化例外） | §5.3、checklist 2.2.1、§0.6.2 | `api.integration.test.ts` ＋ `apps/api` `sleepStartGate.test.ts`（待補） |

### 9.4 文件、型別、體感與檢核敘事

| 勾選 | 項目 | 規格錨點 | 測試閘門 |
| --- | --- | --- | --- |
| [x] | **9.4.1** OpenAPI description／`game_balance_tables.md` 表頭版本與規格 **v1.5.7**、檢核 §3.2 **v0.2** 敘事一致 | §9.3、附錄 C、§0.6.2 | `balanceSeed.test.ts` ＋ `openapiContract.test.ts`（擴充 YAML 錨點版本） |
| [x] | **9.4.2** **`TodayResponse` `required`** 與 `openapiTypes.ts`、實際 `GET /v1/today` 雙向一致（含 `attunementHint`、`homeDockHint`） | §9.3、§0.6 R3、§0.6.2 | `openapiContract.test.ts` ＋ `openapiFieldSync.test.ts`（對照 YAML，非僅鍵名長度） |
| [x] | **9.4.3** **`onboardingPhase`**：API `settled` 與 client 殘留 `steady` 收斂或文件化相容層 | §5.17、§0.6 J7、§0.6.2 | `onboarding.test.ts` ＋ `onboardingCopy.test.ts` |
| [x] | **9.4.4** 首屏 **`worldGrowthValue`** 等工程數字敘事化或收合（**U-J7**） | §7.2、§0.6.1 U-J7、§0.6.2 | `apps/mobile` `stardustNarrative.test.ts` ＋ `progressCopy.test.ts` 擴充 |
| [x] | **9.4.5** 夜空 **`bg_asset_id`** 定稿；真圖／Lottie 取代僅漸層占位（**U-P1**、**8.1.1**） | §5.14、`game_balance_tables.md` §2、§0.6.2 | `balanceSeed.test.ts` ＋ `apps/mobile` `nightSkyAssets.test.ts`（**禁** TBD） |

### 9.5 測試深度（綠燈 ≠ 真接線）

| 勾選 | 項目 | 規格錨點 | 測試閘門 |
| --- | --- | --- | --- |
| [x] | **9.5.1** 行動端次要 API **契約級** 測試取代僅 `typeof` helper（`dayClosure`、`cancelSleep`、`earlyBed`、`reminderPreview`） | §0.6.2、§0.6 J2～J6 | 上列 **9.1** 各 `*Contract.test.ts` 全綠 |
| [x] | **9.5.2** `MemoryArchiveScreen` 與 **`items`** 形狀整合（非僅 fixture `entries`） | §0.6.1 U-J5、§0.6.2 | `MemoryArchiveScreen.test.tsx` 擴充 |
| [x] | **9.5.3** Maestro／E2E 覆蓋 **9.1** 四項契約場景（記憶冊非空、收工成功、早睡、推播預覽） | §0.6 E2、§0.6.2 | `e2eFlow.test.ts` ＋ `night-flow.yaml` 擴充（待補） |

### 9.6 排程與加分加深

| 勾選 | 項目 | 規格錨點 | 測試閘門 |
| --- | --- | --- | --- |
| [x] | **9.6.1** in-app 推播排程綁 **`targetSleepTimeLocal`**（非固定 60 秒 interval） | §5.2、§0.6.1 U-J4、§0.6.2 | `mockPush.test.ts` ＋ `apps/mobile` `pushScheduleAnchor.test.ts`（待補） |
| [x] | **9.6.2** 月亮守護：可選收斂 `today` 內嵌欄位與獨立 `status` 重複請求 | §5.16、§0.6.2 | `moonGuardWeek.test.ts` ＋ `MoonGuardScreen.test.tsx` |
| [x] | **9.6.3** 記憶冊列表呈現 **`createdAt`**（若產品需要時間序） | §5.10、§0.6.2 | `api.integration.test.ts` ＋ `MemoryArchiveScreen.test.tsx` |

---

## 10. 睡前首屏 IA 收斂（§7.3；§9 之後）

**範圍：** 在 **不新增** §0.4 系統級模組前提下，將首屏與儀式 **IA** 收斂為 **小屋／寵物／單一情緒線／主 CTA**；**TonightProgressPanel** 預設 **兩行掃讀**（非 dashboard）；**情境句優先序**、**儀式降噪**、**Reduce Motion**、**無障礙字級**、**四人格 fallback** 句庫。**不** 開 Tab／深連結；Launch 後量測 **僅預留事件名**（§7.3.3）。細節見規格 **§7.3**、`01_UX_FLOW.md`、`02_UI_FLOW.md`。

### 10.1 首屏與進度掃讀

| 勾選 | 項目 | 規格錨點 | 測試閘門 |
| --- | --- | --- | --- |
| [x] | **10.1.1** **TonightHome** Hero 僅情緒線 + 主 CTA；次入口 **可收合**「小屋裡還有」 | §7.3.1 | `TonightHome.test.tsx` |
| [x] | **10.1.2** **TonightProgressPanel** 預設兩行掃讀；連勝／% 僅 **展開** 後 | §7.2、§7.3.1 | `tonightGlanceCopy.test.ts` ＋ `TonightProgressPanel.test.tsx` |
| [x] | **10.1.3** **`pickContextualLine`** 優先序：**儀式狀態** → 寵物情緒 → **`homeDockHint`** → fallback（含 `wilted`、人格 fallback） | §7.3.1、`tone_of_voice.md` §4 | `pickContextualLine.test.ts` |

### 10.2 儀式與體感

| 勾選 | 項目 | 規格錨點 | 測試閘門 |
| --- | --- | --- | --- |
| [x] | **10.2.1** **RitualCountdown** 僅倒數、呼吸光、我要睡了、離開；儀式 phase **不** 顯示同步列／邏輯日 | §7.3.2 | `phaseNavigation.test.ts`（`RitualCountdown`） |
| [x] | **10.2.2** **Reduce Motion** 收斂常駐 loop（寵物浮動、呼吸光） | §7.3.3、`art_direction.md` §3 | `BreathingGlow.test.tsx` ＋ `TonightHome.test.tsx` |
| [x] | **10.2.3** 倒數／主 CTA **無障礙**與大字級上限 | §7.3.3 | `uiPrimitives.test.tsx`（`RitualTimer`／`PrimaryButton`） |
| [x] | **10.2.4** 儀式倒數結束後 **`postRitualDreamLine`** 單句回饋（**非** 微型故事系統） | §5.20、§7.3.2 | `postRitualDreamLine.test.ts` ＋ `VerticalSliceApp`（`post-ritual-dream-line`） |

---

## 11. 情緒節奏與聲音人格（§7.4；§10 之後）

**範圍：** 在 **不新增** §0.4 系統級模組前提下，落地 **`emotional_pacing.md`**、**`sound_direction.md`**；推播 **`pushEmotionalState`** 人格化；行動端 **`emotionalPacing`／`soundProfile`／`expo-audio` 最小播放閉環** 與儀式末 5 秒降噪。細節見規格 **§7.4**、§5.2、§5.7。

### 11.1 規格文件

| 勾選 | 項目 | 規格錨點 | 測試閘門 |
| --- | --- | --- | --- |
| [x] | **11.1.1** **`sound_direction.md`**（夜晚材質、四原型、推播前奏、Reduce Motion／靜音） | §7.4、附錄 B | 文件錨點與 `soundProfile.test.ts` 材質鍵一致 |
| [x] | **11.1.2** **`emotional_pacing.md`**（phase 強度、儀式末 5 秒、推播氣質） | §7.4 | `emotionalPacing.test.ts` |

### 11.2 推播人格化（API）

| 勾選 | 項目 | 規格錨點 | 測試閘門 |
| --- | --- | --- | --- |
| [x] | **11.2.1** **`derivePushEmotionalState`** 與 `worldAttunement`／久未開啟／早睡／連勝對齊 | §5.2、§7.4 | `pushEmotionalState.test.ts` ＋ `apps/mobile` `push/pushEmotionalState.test.ts` |
| [x] | **11.2.2** **`template-goodnight`／`reminder-preview`** 輸出 `title`、`pushEmotionalState`、人格化 `body` | §5.7、OpenAPI | `templateGoodnight.test.ts` ＋ `mockPush.test.ts` ＋ `openapiContract.test.ts` |

### 11.3 行動端節奏與聲音策略

| 勾選 | 項目 | 規格錨點 | 測試閘門 |
| --- | --- | --- | --- |
| [x] | **11.3.1** **`emotionalPacing`**：儀式末 5 秒 **禁** 提示句與 UI 回饋音策略 | §7.4、`emotional_pacing.md` | `emotionalPacing.test.ts` ＋ `uiPrimitives.test.tsx`（`RitualTimer` 空 hint） |
| [x] | **11.3.2** **`soundProfile`／`nightSoundscape`**：四原型材質鍵與推播前奏靜音策略 | `sound_direction.md` §3、§8 | `soundProfile.test.ts` ＋ `push/reminders.test.ts` |
| [x] | **11.3.3** 推播預覽請求帶 **`pushEmotionalState`**（與 `today` 同源） | §5.2、§7.4 | `clientContracts.test.ts` ＋ `VerticalSliceApp` 開機預覽路徑（`mockPush.test.ts`） |
| [x] | **11.3.4** **`expo-audio` 最小播放閉環**（`nightSoundscapePlayback`／`nightSoundscapePlayer`／`useNightSoundscape`；背景停播） | §7.4、`sound_direction.md` §9 | `nightSoundscapePlayback.test.ts` |
| [x] | **11.3.5** **聲音雙開關**（`sound_enabled`／`night_sound_enabled`、睡眠設定 Switch；推播與 in-app 同源 `buildPushSoundProfile`） | §7.4 | `nightSoundPreferences.ts` ＋ `reminderSoundProfile.test.ts` ＋ `soundProfile.test.ts` ＋ `SleepSettingsScreen.test.tsx` |
| [x] | **11.3.6** **`listening/` 音檔與 `SOUND_LICENSES.md`**（邏輯鍵不變、可替換 WAV） | §7.4、附錄 B | `assets/soundPackMount.test.ts` ＋ `apps/mobile/assets/sounds/SOUND_LICENSES.md` |
| [x] | **11.3.7** **首屏單一 ambience**（`bed_home_*` loop；**禁** 曲庫／mixer） | §7.4、§0.6.3 L2 | `nightSoundscapePlayback.test.ts` |
| [x] | **11.3.8** **`sound_asset_policy.md`**（授權、占位替換、雙開關） | §7.4、附錄 B | 文件錨點 ＋ `soundPackMount.test.ts` |

---

## 12. Launch RC 與上架前（§0.6.3；§11 之後）

**範圍：** 在 **不新增** §0.4 系統級模組前提下，完成 **Release Candidate 工程閘門**、**真人睡前驗證**、**Launch 體感補齊** 與 **產品決策邊界**；主軸為讓 **一晚安** 在真機上 **穩、靜、好懂**。細節見規格 **§0.6.3**、§十四。

**建議優先序：** **12.1**（RC 工程閘門）→ **12.2**（真人睡前驗證，可與 12.1 並行）→ **12.3**（體感補齊，依驗證缺口排優先）→ **12.4**（產品決策文件化）→ **12.5**（Launch 前排除項對照，不打勾）。

### 12.1 Release Candidate 工程閘門

| 勾選 | 項目 | 規格錨點 | 測試閘門 |
| --- | --- | --- | --- |
| [x] | **12.1.1** **`DATABASE_URL`** 下 api 整合與 schema **不得 skip** | §0.6.3 RC1、§3.1 | `api.integration.test.ts` ＋ `schemaSnapshot.test.ts` 全綠（exit code 0） |
| [x] | **12.1.2** **`apps/mobile`** 測試全綠（vitest ＋ jest-expo） | §0.6.3 RC2 | `apps/mobile` `npm run test` |
| [x] | **12.1.3** CI **`release`** workflow 與本機驗收一致 | §0.6 E1、§0.6.3 RC1 | `ciWorkflow.test.ts` ＋ `.github/workflows/release.yml` |
| [x] | **12.1.4** Maestro **`night-flow.yaml`** 真機主路徑與 §9 契約場景 | §0.6 E2、§0.6.3 RC3、checklist **9.5.3** | `e2eFlow.test.ts` ＋ `apps/mobile/acceptance/maestro_device_run.json` |
| [x] | **12.1.5** Expo Go **`testID`** 手動對照 §7.3 首屏／儀式 IA | §7.3、§0.6.3 RC4、`01_UX_FLOW.md` | `TonightHome.test.tsx` ＋ `TonightProgressPanel.test.tsx` ＋ `phaseNavigation.test.ts` ＋ `apps/mobile/acceptance/expo_go_manual_ux.json` |

### 12.2 真人睡前驗證（1～2 週）

| 勾選 | 項目 | 規格錨點 | 測試閘門 |
| --- | --- | --- | --- |
| [x] | **12.2.1** **§0.5** 至少 **1 週** 睡前開啟、儀式、起床開箱循環 | §0.5、§六、§0.6.3 H1 | `human_sleep_validation.schema.json` ＋ `humanSleepValidation.ts` ＋ `apps/mobile/acceptance/human_sleep_validation.json` ＋ `launchRcAcceptance.test.ts`（**`status: passed` 須 7 筆無 blocking `records`**） |
| [x] | **12.2.2** **§4.8** 第 1／3／7／14／30 天節奏錨點質性回歸 | §4.8、§0.6.3 H2 | `rhythmMilestones.test.ts` ＋ `apps/mobile/acceptance/rhythm_milestone_qualitative.json` |
| [x] | **12.2.3** 首屏 **情境句優先序**（含 **儀式狀態**）與 **TonightProgressPanel** 兩行掃讀（非 dashboard） | §7.3.1、§0.6.3 H3 | `pickContextualLine.test.ts` ＋ `tonightGlanceCopy.test.ts` ＋ `apps/mobile/acceptance/home_ia_review.json` |
| [x] | **12.2.4** 儀式 **末 5 秒** 降噪與 Reduce Motion／夜晚聲音關閉 | §7.4、`emotional_pacing.md`、`sound_direction.md` §8 | `emotionalPacing.test.ts` ＋ `uiPrimitives.test.tsx` ＋ `apps/mobile/acceptance/ritual_pacing_review.json` |
| [x] | **12.2.5** **Launch 後量測** 僅預留 §7.3.3 事件名（**不要求** 分析面板） | §7.3.3、§0.6.3 H5 | `launchMetrics.test.ts` ＋ `apps/mobile/acceptance/launch_metrics_events.json` |

### 12.3 Launch 體感補齊（依驗證缺口排優先）

| 勾選 | 項目 | 規格錨點 | 測試閘門 |
| --- | --- | --- | --- |
| [x] | **12.3.1** 外部位圖／Lottie 管線；**優先** 三種 `night_sky`、寵物立繪、開箱／記憶插圖 | §0.6.3 L1、`04_FIGMA_SCOPE.md`、`art_direction.md` | `nightSkyAssets.test.ts` ＋ `MemoryIllustration.test.tsx` ＋ `assets/visualAssetManifest.test.ts` |
| [x] | **12.3.2** **`sound_direction.md` §9** `listening/` 最小包掛載、**首屏 ambience** 與 **`expo-audio` 播放** | §7.4、§0.6.3 L2 | `soundProfile.test.ts` ＋ `nightSoundscapePlayback.test.ts` ＋ `assets/soundPackMount.test.ts` |
| [x] | **12.3.3** 真推播營運：權限、勿擾、**`targetSleepTimeLocal`** 對時 | §5.2、§0.6.3 L3 | `mockPush.test.ts` ＋ `pushScheduleAnchor.test.ts` ＋ `push/reminders.test.ts` ＋ `apps/mobile/acceptance/push_device_validation.json` |
| [x] | **12.3.4** 商店包定稿：真機五圖、隱私／資料說明與 **`store_copy.md`** | §十四、§0.6.3 L4 | `marketingCopy.test.ts` ＋ `storeAssets.test.ts`／`storeScreenshots.test.ts` ＋ `apps/mobile/acceptance/store_release_signoff.json` |

### 12.4 Launch 產品決策（文件化）

| 勾選 | 項目 | 規格錨點 | 測試閘門 |
| --- | --- | --- | --- |
| [x] | **12.4.1** **帳號／多裝置** 與換機策略拍板 | §0.6 E4、`05_DOMAIN_AND_PERMISSIONS.md` | `deviceMigration.test.ts` ＋ `apps/mobile/acceptance/launch_decisions.json` |
| [x] | **12.4.2** **第 4 階** 與夜空／夢內容加量是否納入 Launch | §十三 順序 **3**、`game_balance_tables.md` | `rhythmMilestones.test.ts` ＋ `balanceSeed.test.ts` ＋ `apps/mobile/acceptance/launch_decisions.json` |
| [x] | **12.4.3** **Tab／深連結** 與 **手動補登 App 入口** 維持 Launch 外 | §7.3.3、§9.2.6、§0.6.3 | `deviceMigration.test.ts` ＋ `api.integration.test.ts`（`manual-record` 無 App 入口） |

### 12.5 Launch 前刻意排除（對照，不打勾）

| 項目 | 規格 |
| ---- | ---- |
| 微型故事、季節夢境池、NPC、Health／AI／社交 | §0.3、§十二 |
| 首屏再堆連勝／星塵／多條提示 | §7.3.1 |
| 儀式新任務音或末段提示句 | §7.4、`emotional_pacing.md` |

---

## 13. 檢核收斂與後續邊界（§0.7；§12 之後）

**範圍：** **§1～§12 已全勾** 後之 **檢核外** 工作與 **刻意不做** 對照；**不** 新增 §0.4 系統級模組；**不** 新增測試閘門列；**不** 與 §1～§12 混勾。細節見規格 **§0.7**、§十三 順序 **3**、§十四。

### 13.1 檢核表範圍內（已收斂）

| 區塊 | 狀態 |
| ---- | ---- |
| **§1～§4** 可用產品必做 | 已全勾 |
| **§7～§11** 專業加分、UI 深化、接軌、IA、情緒／聲音 | 已全勾 |
| **§12** Launch RC 與上架前 | 已全勾（**2026-05-15** 計數見 §0；mobile **131**） |

### 13.2 RC 紀錄語意（§12 已勾 ≠ 實地驗完）

| 主題 | 檢核已達 | 仍須補強 |
| ---- | -------- | -------- |
| **Maestro** | `e2eFlow.test.ts` ＋ `apps/mobile/acceptance/maestro_device_run.json` | **真機** 執行 `.maestro/night-flow.yaml` |
| **§12.2 睡前驗證** | `human_sleep_validation.schema.json` ＋ `humanSleepValidation.ts` ＋ `launchRcAcceptance.test.ts` | **真人** 連續 **≥1 週** 睡前循環與 §4.8 質性回歸；`human_sleep_validation.json` 須累積 **7** 筆無 `blockingIssues` 紀錄後方可 `status: passed` |
| **整合測** | CI `release` 須 `DATABASE_URL` | 未設時整合／schema 測試 **skip**，**不** 視為正式驗收 |

### 13.3 Launch 後與刻意不做

| 類別 | 內容 | 錨點 |
| ---- | ---- | ---- |
| **順序 3** | 第 4 階內容量產、更多夜空／夢、季節池、微型故事試點 | §十三 順序 **3**；`apps/mobile/acceptance/launch_decisions.json` |
| **帳號／營運** | 帳號／多裝置、真推播營運後端、量測上報 | §0.6.2、`05_DOMAIN_AND_PERMISSIONS.md` |
| **體感量產** | 外部位圖／Lottie、**正式 listening WAV 替換占位**、曲庫／mixer | `visualAssetManifest.ts`、`assets/sounds/listening/`、`SOUND_LICENSES.md`、`sound_asset_policy.md` |
| **Slice 外入口** | Tab／深連結、手動補登 App | §7.3.3、§9.2.6 |
| **刻意排除** | 微型故事、季節夢境池、NPC、Health／AI／社交 | 本檔 **§5**、**§12.5**；規格 §0.3、§十二 |

### 13.4 文件與數值未定

| 項目 | 錨點 |
| ---- | ---- |
| 日界係數、蔫／恢復、月亮週限、掉落微調 | 規格附錄 A；`game_balance_tables.md` |
| 世界觀待補段落 | `GOODNIGHT_PLANET_LORE_BIBLE.md` |

---

*本檢核表與 [`GOODNIGHT_PLANET_MVP_SPEC.md`](./GOODNIGHT_PLANET_MVP_SPEC.md)（**v1.5.11**）及 **`docs/`** 內關聯支援文件同步維護；新增規格項時應同步新增「測試閘門」列，並確認錨點章節於現行規格正文仍存在。§9 接軌項須與規格 **§0.6.2** 同步更新；§10 須與 **§7.3** 同步更新；§11 須與 **§7.4** 同步更新；§12 須與 **§0.6.3** 同步更新；§13 須與 **§0.7** 同步更新（**不打勾**）。*
