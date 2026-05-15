# 晚安星球 Goodnight Planet｜產品規格書（MVP v1.5.11）

| 項目 | 說明 |
| ---- | ---- |
| 文件版本 | MVP v1.5.11 |
| 更新日期 | 2026-05-15 |
| 前一版本 | MVP v1.5.10 |
| 狀態 | **檢核表 §1～§12 已全勾（工程交付收斂）；§0.7 界定檢核外仍須真機／真人補強、Launch 後順序 3 與刻意排除；§0.6.3／§12 見 `MVP_DEV_CHECKLIST.md` §12** |

**v1.5.11 補丁：** **§7.3～§7.4** 落地 **體感收斂**（**不** 新增 §0.4 系統級模組、**不** 做首屏減法）：**`pickContextualLine`** 優先序改為 **儀式狀態 → 寵物情緒 → `homeDockHint` → fallback**；儀式倒數結束後 **`postRitualDreamLine`** 一句情緒回饋（**非** 微型故事系統）；**`sound_enabled`**／**`night_sound_enabled`** 雙開關；首屏 **單一 ambience**（`bed_home_*` → `listening/` 占位）；**`sound_asset_policy.md`**；**`TonightProgressPanel`** 階梯 **僅展示 1～3 階**（後端仍保留第 4 階）。**Launch 前** 仍須 **正式可商用 WAV** 替換占位；**Launch 後** 方可 **降規格** 試點季節 tag／一句夢境文案 A/B（**不** 做 season 表／連載故事）。

**v1.5.10 補丁：** **§7.4** 補齊 **`expo-audio` 最小睡前聲音閉環**——`nightSoundscapePlayback.ts`／`nightSoundscapePlayer.ts`／`useNightSoundscape.ts`；**`assets/sounds/listening/`** 五支低刺激 WAV、`SOUND_LICENSES.md`；**`night_sound_enabled`**（AsyncStorage）與推播 **`buildPushSoundProfile`** 同源；**`human_sleep_validation.schema.json`** 與 §0.7 **真人 7 晚** 語意；**不** 新增 §0.4 系統級模組、**不** 做曲庫／mixer。

**v1.5.9 補丁：** 新增 **§0.7 檢核收斂與後續工作邊界**——**§1～§12 全勾** 後之 **RC 紀錄語意**、**真機／真人** 與 **Launch 後** 工作分界；**不** 新增 §0.4 系統級模組；對照 `MVP_DEV_CHECKLIST.md` **§13**（**不打勾**）。

**v1.5.8 補丁：** 新增 **§0.6.3 Launch RC 與上架前最後一哩**——**§1～§11 全勾後** 之工程閘門、真人睡前驗證、Launch 體感補齊與產品決策邊界；**不** 新增 §0.4 系統級模組；驗收對照 `MVP_DEV_CHECKLIST.md` **§12**。

**v1.5.7 補丁：** 新增 **§7.4 情緒節奏與聲音人格**——`emotional_pacing.md`、`sound_direction.md`；推播 **`pushEmotionalState`** × 四原型短模板與 **環境標題**；行動端 **`emotionalPacing`／`soundProfile`** 與儀式末 5 秒降噪；**不** 新增 §0.4 系統級模組。

**v1.5.6 補丁：** 新增 **§7.3 睡前首屏與儀式 IA**——首屏 **小屋／寵物／單一情緒線／主 CTA**；**TonightProgressPanel** 預設 **兩行掃讀**（非 dashboard）；**情境句優先序** 與 **儀式降噪**；**Reduce Motion**、**無障礙字級**、**四人格 fallback** 句庫與 **Launch 後量測事件名**（僅規劃）。**不** 新增 §0.4 系統級模組；**不** 開 Tab／深連結。

**v1.5.5 補丁：** 新增 **§0.6.2 前後端接軌稽核**——靜態對照 `apps/api`、`apps/mobile`、`contracts/openapi.yaml` 與 §7／§8 敘事；後續接軌項與測試閘門見 `docs/MVP_DEV_CHECKLIST.md` **§9**（**不** 取代 §1～§8 已勾項；**不** 新增 §0.4 系統級模組）。

**v1.5.4 補丁：** 新增 **§0.6.1 前端 UI 深化（§7 後續加分）**——在 **不新增** §0.4 系統級模組前提下，將 §7 已達 **接線／閘門** 與 **專業體感** 之落差寫入規格；驗收對照 `docs/MVP_DEV_CHECKLIST.md` **§8**。

**v1.5.3 補丁：** 新增 **§0.6 可用產品 → 專業產品（加分項）**——依 **體感與投入比** 分五梯，**不新增** §0.4 系統級模組；驗收對照 `docs/MVP_DEV_CHECKLIST.md` **§7**。

**v1.5.2 補丁：** 規格 **自包含化** —— §3、§4、§5.5、§5.6～5.10、§5.16～5.19、§十 不再以「同 v1.4」帶過，直接落實 MVP 細節；新增 §9.3 **API 端點清單**、§9.4 **錯誤碼／柔性文案契約**；§十 對齊現行 migration 001～006；附錄 C 同步 `contracts/openapi.yaml` v0.2 範圍。

**v1.5.1 補丁：** **IP 安全呈現**——記憶冊／稀有度 **敘事化**（禁圖鑑編號、禁卡牌 SSR／UR 式行銷）；寵物 **繪本癒感**；行銷 **情緒陪伴** 非夢獸收集；新增 **`art_direction.md`**（見 §八、附錄 B）。

**🔥 v1.5 定位：** 在 v1.4 完整設計基礎上 **強制裁切 MVP**，避免 Live Service 規模塞進第一版；並 **凍結系統數量**（見 §0.4）。

**變更摘要（v1.4 → v1.5）：**  
(1) **範圍凍結**：**不再新增系統**（僅允許數值／文案／資產迭代）；新增 **MVP 必做 vs Launch 後更新**。  
(2) **移出 MVP**：**微型故事系統**→改 **「晚安一句話」**；**季節夢境池／LiveOps**；**NPC 訪客**。  
(3) **世界階梯**：MVP **只做 3～4 階**，不追求完整長線表。  
(4) **耦合治理**：夜空／Forecast／掉落／成長／背景 **規則集中** → `game_balance_tables.md`。  
(5) **節奏標靶**：第 1／3／7／14／30 天 **感受錨點**（見 §4.8）。  
(6) **UX**：補 **清晰進度感**（完成度、連勝、世界進度、**夜空特色敘事 tag**——**禁止**圖鑑／SSR 式表述），避免「太文青但不知好不好」。  
(7) **世界張力**：**可逆牽掛**——久未來時環境略蔫、**想念語氣**，**非 guilt**（§5.12）。  
(8) **品牌**：定性為 **B. IP 型產品**，輔助 **`tone_of_voice.md`**。  
(9) **交付策略**：先做 **Vertical Slice**（§0.5），再擴功能。

---

## 文件導讀

| 區塊 | 內容 |
| ---- | ---- |
| §0～§1 | 範圍、MVP／Launch、Vertical Slice、**可用→專業加分**、**前端 UI 深化**、**前後端接軌稽核**、**睡前 IA 收斂**、**情緒節奏與聲音人格**、**Launch RC 與上架前**、**檢核收斂與後續邊界**、產品定性 |
| §2～§4 | 原則、狀態機、規則與節奏 |
| §5 | 功能（已标注 MVP／Launch） |
| §6～§10 | 流程、畫面、技術、資料 |
| §11～§18 | 商業、路線圖、上架、追溯、Lore |
| 附錄 | 未定案、`game_balance_tables.md`、`tone_of_voice.md`、**`art_direction.md`**、**`emotional_pacing.md`**、**`sound_direction.md`** |

**`docs/` 整包參照：** 本規格書與附錄所列檔案皆位於 repository 之 **`docs/`** 資料夾（本機常見路徑：`C:\GOODNIGHT_PLANET\docs`）。實作、設計與驗收時，除下述章節與 **附錄 B** 外，應 **一併查閱該資料夾內其他與 MVP 相關之支援文件**（例如開發檢核、UX／UI 流程、網域權限、設計交付範圍等），不得以單一規格書涵蓋全部細節。

---

## 0. 一句話、範圍與凍結

### 0.1 一句話

**陪伴使用者願意結束今天**——透過 **會長大的夜晚世界**、有性格的寵物、儀式與 **夢境收集**，降低睡眠拖延。

### 0.2 🔥 MVP 必做（Launch 前）

| # | 模組 | 說明 |
| --- | ---- | ---- |
| 1 | **晚安儀式** | 夜晚 UI → **30 秒倒數** →「我要睡了」→ `sleeping`（§5.3）；**不做自動入睡偵測**。 |
| 2 | **單寵陪伴 × 人格** | 一人一寵；**性格原型** + 核心句變體（§3.3、§5.5）。 |
| 3 | **今夜夜空 + Forecast** | **少量夜空 variant**（Vertical Slice：**3 種**起步）；驅動 **背景 + 掉落權重**（§5.14）。 |
| 4 | **晚安開箱** | 起床後開箱 → 記憶冊登錄（**少量夢類型**，Slice：**5 種**）。 |
| 5 | **世界成長** | 成長值 + **3～4 階**世界狀態（§5.12）；**不開** NPC、長線多階。 |
| 6 | **月亮守護** | 敘事版、限次（§5.16）。 |
| 7 | **logical_sleep_date** | 日界與連勝／日結算（§4.6）；**底層必做**。 |
| 8 | **晚安一句話** | 替代微型故事：**一句 IP 晚安**（可輪替），**非**長文本系統（§5.20）。 |
| 9 | **清晰進度 UI** | 今夜夜空 **敘事 tag**、儀式與世界進度 **可辨**（§7.2、§7.3）；**預設** 兩行掃讀，**展開** 後才見連勝／% 等；禁卡牌階級用語。 |

### 0.3 ❌ Launch 後再開（嚴禁塞進 MVP）

| 項目 | 理由 |
| ---- | ---- |
| **微型故事系統**（30s 連載文本管線） | **內容／校對成本高**，會拖垮迭代 |
| **季節夢境池／LiveOps** | 需 **活動節奏、池維護**，屬 Live Service |
| **NPC 訪客／居民剪影玩法** | **美術+文案量爆炸** |
| **大量夢／夜空組合** | 先做 Slice 驗證 **睡前是否想開**，再加量 |

### 0.4 🔥 範圍凍結聲明（v1.5）

自 **v1.5** 起：**不再新增「系統級」模組**（新表格、新循環、新 LiveOps 類型）。  
若需新增，必須：**版本升級（v1.6+）+ 明確取代／延後項目 + 時程評估**。

### 0.5 Vertical Slice（先做薄片驗證）

**目的：** 驗證 **睡前想開、陪伴感、連續使用**，優於堆功能。

| 資產／範圍 | Slice 上限（建議） |
| ---------- | ------------------ |
| 寵物 | **1** 隻（含 **1** 種人格） |
| 夜空 | **3** 種 |
| 夢類型（記憶冊） | **5** 種 |
| 世界階段 | **3** 階（第 4 階可標 Launch） |
| 人格晚安句 | **10** 句級（可輪替） |
| 循環驗證 | **至少 1 週**內測／可用性 |

通過後才擴：**更多夜空、夢、階段與文案**，並依 **`game_balance_tables.md`** 調权。

### 0.6 可用產品 → 專業產品（加分項）

**前提：** `docs/MVP_DEV_CHECKLIST.md` **§1～§4** 全勾為 **可用產品** 底線（後端規則、契約、測試閘門）。本節為 **在同架構內** 拉高體感與上架就緒，**不** 新增 §0.4 禁止之系統級模組（新表、新循環、LiveOps 類型）。驗收細項與測試閘門見 **`MVP_DEV_CHECKLIST.md` §7**；§7 後之 **前端 UI 深化** 見 **§0.6.1** 與檢核表 **§8**。

**現況落差（摘要）：**

| 層面 | 可用產品（MVP 已達） | 專業產品常見期待 |
| ---- | -------------------- | ---------------- |
| 後端／規則 | OpenAPI v0.2、17 端點、migration、整合測試 | 同左 |
| 行動端 | `VerticalSliceApp` 多 phase；**§7～§9** 測試閘門已勾；主／次要 API 與 `client.ts` 契約已對齊 OpenAPI v0.2 | Launch：完整 IA、外部位圖／Lottie 管線、真推播營運 |
| 美術／動效 | Design Token；`game_balance_tables.md` §2 **`bg_asset_id`** 已定稿；行動端以場景層／幾何資產落地 | 外部位圖／Lottie 與 `04_FIGMA_SCOPE.md` 六屏量產 |
| 營運 | 推播 mock、商店短文案 | 真實提醒、商店五圖、隱私／合規 |

**加分項（依體感與投入比）：**

#### 第一梯：體感最大（視覺與 IP 呈現）

| # | 項目 | 說明 | 錨點 |
| --- | ---- | ---- | ---- |
| P1 | **夜空與小屋場景** | 三種 `night_sky` 各對應背景／漸層（`bg_asset_id` 落地），首屏「今夜」由資訊卡升級為場景 | §5.14、`game_balance_tables.md` §2、`art_direction.md` §2 |
| P2 | **寵物與記憶冊插圖** | 單寵「小燈」繪本向立繪或剪影；開箱／記憶冊具小插圖位，**禁** 圖鑑格／稀有度框 | §3.3、§5.5、§5.10、`art_direction.md` §4 |
| P3 | **動效與轉場** | 儀式倒數呼吸脈動、開箱柔光擴散、階梯亮起；**慢**、不閃爍、非開卡金光 | `art_direction.md` §3、`02_UI_FLOW.md` |
| P4 | **可逆牽掛視覺化** | `worldAttunement`／`attunementHint` 除文案外，調整 token（如 `state.attune_low`）或背景飽和，久未開 App 略蔫、儀式後恢復 | §4.7、§5.12、`game_balance_tables.md` §7、`03_MOODBOARD.md` |
| P5 | **Figma 六屏與元件庫** | TonightHome → RitualCountdown → Sleeping → UnboxReveal → MemorySnippet → WorldProgress；Button／Tag／Progress／Timer 與 `tokens.ts` 一致 | `04_FIGMA_SCOPE.md`、`02_UI_FLOW.md` §7.2 |

#### 第二梯：旅程完整度（後端已有、App 須接線）

| # | 項目 | 說明 | 錨點 |
| --- | ---- | ---- | ---- |
| J1 | **`cancel_sleep` 契約** | 儀式離開若已 `sleep/start`，須 `POST /v1/sleep/cancel` 與柔性 `message`，非僅前端切 phase | §5.3、§9.4、`tone_of_voice.md` §5.1 |
| J2 | **今天結束儀式** | `POST /v1/ritual/day-closure` 可選路徑，與主晚安流並行、不阻擋入睡 | §5.9 |
| J3 | **月亮守護** | `moon-guard/status`、`trigger` 敘事入口與週限回饋 | §5.16 |
| J4 | **睡眠時間與早睡** | `PATCH /v1/me/sleep-schedule`、`POST /v1/daily/early-bed` 設定 UI；早睡僅固定掉落表倍率 | §5.1、§5.19 |
| J5 | **記憶冊列表** | `GET /v1/memory-entries` 可翻閱歷史，非僅當晚一則 | §5.10 |
| J6 | **推播與 in-app 召回** | `reminder-preview`／`template-goodnight` 接裝置通知（MVP 可先 Expo Notifications） | §5.2、§5.7 |
| J7 | **細節對齊** | `onboardingPhase` 與規格一致（`settled` 非 `steady`）；首屏不暴露內部欄位（如邏輯日鍵名） | §5.17、§7.2 |

#### 第三梯：可靠感與在地化

| # | 項目 | 說明 | 錨點 |
| --- | ---- | ---- | ---- |
| R1 | **錯誤與離線** | 儀式與本地倒數可離線；同步失敗佇列／重試；使用者可見字串過語氣黑名單，**禁** 裸 `error` 碼 | `01_UX_FLOW.md` 錯誤與邊界、§9.4 |
| R2 | **邏輯日與時區** | `logical_sleep_date` 與使用者時區（如 `Asia/Taipei`）對齊策略落地 | §4.6、`logicalDate.ts` |
| R3 | **契約型別** | OpenAPI 與 mobile client 同步（codegen 或共享型別），避免 `today` 欄位漂移 | §9.3、附錄 C |

#### 第四梯：工程與上架（體感間接、長期必要）

| # | 項目 | 說明 | 錨點 |
| --- | ---- | ---- | ---- |
| E1 | **CI** | release 前強制 `apps/api`／`apps/mobile` 測試全綠；整合測 **須** `DATABASE_URL` | `MVP_DEV_CHECKLIST.md` §0 |
| E2 | **裝置 E2E** | 主路徑（bootstrap → 儀式 → 睡 → 醒 → 開箱）Maestro／Detox 等 | §0.5、§六 |
| E3 | **商店與合規** | 五圖、隱私、資料說明；行銷過 `store_copy.md`、`art_direction.md` §5 | §十四、§八.4 |
| E4 | **帳號與裝置** | 換機／多裝置策略（Slice 僅 `x-device-id` 之 Launch 議題） | `05_DOMAIN_AND_PERMISSIONS.md` |

#### 第五梯：內容加深（§0.4 內迭代，非新系統）

| # | 項目 | 說明 | 錨點 |
| --- | ---- | ---- | ---- |
| C1 | **句庫與夢／夜空加量** | 晚安句、夢類型、夜空 variant 在 Slice 上限內擴充 | §0.5、§5.20 |
| C2 | **第 4 階與節奏係數** | 世界最高階場景感；§4.8 實測偏慢時 **只調** `game_balance_tables.md` | §4.8、§5.12、`game_balance_tables.md` §5 |

**建議單輪專業化 Sprint 順序（僅參考）：** P1～P5 → J1～J7 → R1～R3 → E1～E4 → C1～C2。與 §十三 順序 **2**（Launch 內容加量）可並行，但須各自獨立驗收。**§7 全勾後**，依 **§0.6.1** 與 `MVP_DEV_CHECKLIST.md` **§8** 進行 **前端 UI 深化**（仍不新增 §0.4 系統）。

### 0.6.1 前端 UI 深化（§7 後續加分）

**前提：** `MVP_DEV_CHECKLIST.md` **§7** 全勾代表 **可用→專業** 之 **接線、最小視覺與測試閘門** 已達標；本節描述 **同一架構內** 將體感由「可跑 Vertical Slice」推向「專業產品」之 **執行層落差**。**不** 取代 §7 已勾項；**不** 新增 §0.4 系統級模組。驗收細項見 **`MVP_DEV_CHECKLIST.md` §8**。

**§7 與 §8 關係（摘要）：**

| 層次 | §7（第一輪） | §8（第二輪 UI 深化） |
| ---- | ------------ | -------------------- |
| 目標 | 主路徑 API 接線、六屏 `testID`、最小 token／漸層／佔位插圖 | 場景化資產、繪本 IP、慢動效、次要旅程 **IA**、語氣化錯誤與上架截圖 |
| 實作態 | `VerticalSliceApp` phase 切換、程式化背景與幾何插圖 | 真圖／Lottie、`02_UI_FLOW.md` Stack 轉場、Figma 元件庫補齊 |
| 驗收 | 既有 §7 測試閘門全綠 | §8 各列測試閘門全綠後方可勾選 |

**六屏：§7 達標態 vs 專業 UI 期待**

| 畫面（`04_FIGMA_SCOPE.md`） | §7 達標態（摘要） | 專業 UI 期待（§8） |
| --------------------------- | ----------------- | ------------------ |
| **TonightHome** | 進度面板、Forecast、晚安句、主 CTA；`NightSkyBackdrop` 色塊漸層 | **場景化**首屏（`bg_asset_id` 真資產＋小屋層次）；**繪本立繪**；**單一情緒線**；**TonightProgressPanel** 預設 **兩行掃讀**；次要入口 **可收合**（**禁** 首屏多 Ghost 並列、**禁** 另開「更多」頁） |
| **RitualCountdown** | 30s 倒數、`BreathingGlow`、離開／我要睡了 | 獨立 **Timer**／呼吸節奏；**僅** 倒數、呼吸光、**我要睡了**、離開；**禁** 儀式內次要導覽／步驟 checklist／同步列 |
| **Sleeping** | 極簡文案卡 | **柔光停留**（床邊／窗邊氛圍）；少互動、非載入轉圈感 |
| **UnboxReveal** | 夢名揭示＋進記憶冊 | **柔光擴散** reveal（禁開卡金光）；非 `ActivityIndicator` 式中繼 |
| **MemorySnippet** | 日期＋一句＋抽象插圖位 | **依 `dreamKey`／`nightSkyKey` 差異化**小插圖；像 **回憶冊** 而非 log |
| **WorldProgress** | 階梯四格窗＋線性 % | 階段 **亮起**慢動效；`worldTierStory` 與場景敘事一致 |

**加分項（依體感與投入比；對應 `MVP_DEV_CHECKLIST.md` §8）：**

#### 8.1 體感深化（§0.6 P1～P5 執行層）

| # | 項目 | 說明 | 錨點 |
| --- | ---- | ---- | ---- |
| U-P1 | **夜空／小屋場景資產** | `nightSky.key` 對應 **真圖／Lottie**（`bg_asset_id`），首屏由資訊卡升級為 **可辨識場景** | §5.14、`game_balance_tables.md` §2、`art_direction.md` §2 |
| U-P2 | **繪本寵物與記憶插圖** | 單寵 **小燈**立繪或剪影；開箱／記憶／列表 **依夢種與夜空**換圖；**禁**圖鑑格／稀有度框 | §3.3、§5.10、`art_direction.md` §4 |
| U-P3 | **慢動效與 Stack 轉場** | 開箱柔光、階梯亮起、六屏 **慢**轉場（對齊 `02_UI_FLOW.md` Stack）；**禁**強閃／開卡金光 | `art_direction.md` §3、`02_UI_FLOW.md` |
| U-P4 | **可逆牽掛成套視覺** | `worldAttunement`／`attunementHint`／稀有度 Tag／寵物 **蔫→恢復** 一致；非僅背景飽和 | §4.7、§5.12、`game_balance_tables.md` §7 |
| U-P5 | **Figma 元件庫補齊** | 敘事 **Tag**、**ProgressRing** 或等價、**Timer** 自 `tokens.ts` 抽出；Expo Go **截圖對照表** | `04_FIGMA_SCOPE.md`、`03_MOODBOARD.md` |

#### 8.2 旅程 UI 收斂（§0.6 J2～J7 體驗層）

| # | 項目 | 說明 | 錨點 |
| --- | ---- | ---- | ---- |
| U-J2 | **今天收工儀式感** | `day-closure` 具 **確認／回饋** 與主晚安流 **視覺區隔**；非僅首屏 Ghost | §5.9、`tone_of_voice.md` |
| U-J3 | **月亮守護敘事入口** | 週限與 `trigger` **敘事化**（柔光／月相）；非表單式說明卡 | §5.16 |
| U-J4 | **睡眠設定體驗** | 原生 **時間選擇**；就寢錨與 **今夜 Forecast** 關聯呈現；推播開關與 **實際排程**雙向一致 | §5.1、§5.19、§5.2 |
| U-J5 | **記憶冊翻閱** | 列表含 **夢名／小插圖**；翻閱像冊子 | §5.10 |
| U-J6 | **推播與 in-app 預覽** | 設定頁與 token／排程 **同步**；in-app **預覽卡**（`reminder-preview`） | §5.2、§5.7 |
| U-J7 | **首屏細節** | **單一情緒線**（`pickContextualLine` 優先序）；`homeDockHint`／`attunementHint`／星塵／新手 **不同屏堆疊**；工程欄位 **展開後** 或敘事化 | §5.17、§7.2、§7.3 |

#### 8.3 可靠感 UX（§0.6 R1～R3 呈現層）

| # | 項目 | 說明 | 錨點 |
| --- | ---- | ---- | ---- |
| U-R1 | **語氣化錯誤與離線態** | 使用者可見字串 **禁**裸 `error` 碼；離線佇列 **同步中／已暫存** 狀態列（**儀式 phase 不顯示**，見 §7.3） | `01_UX_FLOW.md`、§9.4、`tone_of_voice.md` |
| U-R2 | **邏輯日邊界說明** | 顯示用日期與 **日界 5:00**（`SLEEP_ROLLOVER_HOUR` 預設）策略一致；必要時 **輕提示**（非教學長文） | §4.6 |
| U-R3 | **契約型別與畫面同步** | OpenAPI／`TodayResponse` 擴欄時，**畫面欄位**與型別 **同 PR** 更新 | §9.3、附錄 C |

#### 8.4 上架呈現（§0.6 E3 體感面）

| # | 項目 | 說明 | 錨點 |
| --- | ---- | ---- | ---- |
| U-E3 | **商店五圖與六屏一致** | `docs/store_assets` 為 **真機截圖**（非佔位 PNG）；與 `store_copy.md`、`art_direction.md` §5 一致 | §十四、§八.4 |

#### 8.5 內容對應 UI（§0.6 C1～C2 呈現層）

| # | 項目 | 說明 | 錨點 |
| --- | ---- | ---- | ---- |
| U-C1 | **句庫／夢／夜空加量之前端** | API 加量後，首屏與開箱 **輪播／微差視覺** 可辨，避免「同殼不同字」 | §0.5、§5.20 |
| U-C2 | **第 4 階場景敘事** | `worldTier` 4 與 `progressCopy`／世界畫面 **同一套場景語彙** | §4.8、§5.12 |

**建議 §8 Sprint 順序（僅參考）：** U-P1 → U-P2 → U-P3 → U-P4 → U-P5 → U-J2～U-J7 → U-R1～U-R3 → U-E3 → U-C1～U-C2。

### 0.6.2 前後端接軌稽核（2026-05-13）

**範圍：** 靜態對照 `apps/api`、`apps/mobile`、`contracts/openapi.yaml` 與 `docs/` 支援文件；**不** 取代 §1～§4 必做或 §7／§8 已勾項。**後續接軌** 驗收與測試閘門見 **`MVP_DEV_CHECKLIST.md` §9**（**§9 已全勾**；本節為稽核快照與**現行落地**對照，**2026-05-13 文件同步**）。

**摘要：** 後端 **17** 業務端點與 OpenAPI **路由層** 對齊；`api.integration.test.ts` 與行動端 **契約級** 測試（如 `clientContracts.test.ts`、`sleepStartGate.test.ts`）已納入 release 全綠計數。下列「稽核當時」欄位僅供追溯；**現行**以程式與檢核表 §9 為準。

#### 契約與次要旅程（稽核當時 → 現行）

| 主題 | 稽核當時 | 現行（§9 後） |
| ---- | -------- | ------------- |
| 記憶冊列表 | `client` 解析 `entries` | `GET /v1/memory-entries` → **`items`**；`MemoryArchiveScreen` 接線 |
| 今天收工 | `postDayClosure` 無 body | **`{ action: 'complete' \| 'skip' }`**；含略過收工 UI |
| 早睡 | 送 `{ enabled }` | 送 **`{ earlyBed: boolean }`** |
| 推播預覽 | 未帶 `templateKey` | query **`templateKey`**；設定頁 in-app 預覽卡 |
| 取消入睡 | 型別與 OpenAPI 不全等 | **`{ cancelled, message }`**；400 仍讀柔性 `message` |

#### 後端已暴露欄位（現行呈現）

| 來源 | 欄位／能力 | 現行 |
| ---- | ---------- | ---- |
| `GET /v1/today` | 輕統計、`daysSinceLastOpenLogical` | **TonightProgressPanel 展開後** `light-stats-banner`（預設不 dashboard 化） |
| `GET /v1/today`、`PATCH sleep-schedule` | `targetSleepDurationMinutes` | 睡眠設定頁顯示 |
| `POST /v1/unbox` | `stardustBalance` | 開箱 reveal 敘事化回饋 |
| `GET /v1/push/template-goodnight` | 系統短模板 | 設定頁 **模板晚安** 預覽卡 |
| `POST /v1/sleep/manual-record` | 手動補登 | **僅 API**；App **Launch 外**（見 `05_DOMAIN_AND_PERMISSIONS.md`） |
| `POST /v1/bootstrap` | `userId` | 契約層保留；首屏 **未** 消費（Launch 帳號前） |

#### 邏輯日、時區、儀式邊界（現行）

| 主題 | 規格／平衡表 | 後端 | 行動端 |
| ---- | ------------ | ---- | ------ |
| 日界 | **§4.6**、`game_balance_tables.md` §1：預設 **5** | `logicalDate.ts`：`(now − rollover 小時)` 之 **`USER_TIMEZONE`（預設 `Asia/Taipei`）** 本機日 | `LogicalDateHint`：台北時區 **5 點**前輕提示 |
| 儀式倒數 | **§5.3**：須 `countdown-complete` | `sleep/start` **須** 當日 `ritual_countdown_completed`；否則 `ritual_incomplete` | 倒數歸零後才啟用「我要睡了」 |

#### 文件、型別與測試（現行）

| 主題 | 現行 |
| ---- | ---- |
| 文件版本 | `openapi.yaml` description **v1.5.5**；本規格 **v1.5.7**；`game_balance_tables.md` **v0.2** |
| 推播人格 | `pushEmotionalState` × 四原型；`template-goodnight`／`reminder-preview` 含 **`title`**；可選 query 覆寫；未帶則依當日狀態推導（§5.2、§5.7、§7.4） |
| 夜空資產 | 平衡表 §2 **`bg_clear_star`／`bg_soft_rain`／`bg_blue_moon`**；行動端場景層＋幾何資產（外部位圖／Lottie 屬 Launch 管線） |
| 新手期 | API **`settled`**；`onboardingCopy` **相容** 殘留 `steady` |
| 工程數字 | **`worldGrowthValue`／星塵** 等 **展開後** 或敘事化；首屏 **不** 與情緒線並列 |
| 推播排程 | in-app 排程錨 **`targetSleepTimeLocal`**（非固定 60 秒） |
| `TodayResponse` required | OpenAPI 含 **`attunementHint`／`homeDockHint`**；與 `openapiTypes.ts` 對照測試 |
| 測試深度 | **`clientContracts.test.ts`**、Maestro **`night-flow.yaml`** 擴充次要旅程 |

**Launch 仍待（非 §9 回溯）：** 帳號／多裝置進度合併、真推播營運、外部位圖／Lottie 量產管線；**§12 工程閘門已勾** 後之 **真機／真人** 與 **Launch 後** 細項見 **§0.7**、`MVP_DEV_CHECKLIST.md` **§13**。

### 0.6.3 Launch RC 與上架前最後一哩（v1.5.8）

**前提：** `docs/MVP_DEV_CHECKLIST.md` **§1～§11** 全勾（含 **2026-05-14** release 驗收計數）；**不** 取代 §0.2 必做或 §7～§11 已勾敘事；**不** 新增 §0.4 系統級模組。**§12 已全勾**（**2026-05-14** 計數：api **87**、mobile **113**）；**§12.2** 內測紀錄 **不** 等同真機連續一週實測，語意見 **§0.7**。

**一句主軸：** 先讓 **一晚安** 在真機上 **穩、靜、好懂**，再談內容加量或新系統。

**建議順序（僅參考）：** RC 工程閘門 → 真人睡前驗證（與 RC 並行）→ Launch 體感補齊（依驗證缺口排優先）→ 產品決策邊界文件化。

#### RC 工程閘門

| # | 項目 | 說明 | 錨點 |
| --- | ---- | ---- | ---- |
| RC1 | **整合測全綠** | `DATABASE_URL` 下 **不得 skip** `api.integration.test.ts`、`schemaSnapshot.test.ts`；與 CI `release` job 一致 | 檢核表 §0、§3.1；`.github/workflows/release.yml` |
| RC2 | **行動端測試全綠** | `apps/mobile` `npm run test`（vitest ＋ jest-expo）exit code 0 | 檢核表 §0 |
| RC3 | **裝置 E2E** | Maestro **`night-flow.yaml`** 覆蓋主路徑與 §9 契約場景；**真機** 跑通並留存紀錄 | §0.6 E2、檢核表 **9.5.3** |
| RC4 | **Expo Go 手動對照** | `testID` 與 §7.3 首屏／儀式 IA 一致（Hero 單情緒線、收合次要入口、儀式無同步列／邏輯日） | §7.3、`01_UX_FLOW.md`、`TonightProgressPanel.test.tsx` |

#### 真人睡前驗證（1～2 週）

| # | 項目 | 說明 | 錨點 |
| --- | ---- | ---- | ---- |
| H1 | **Slice 一週循環** | 對齊 §0.5：**至少 1 週** 睡前開啟、儀式、起床開箱 | §0.5、§六 |
| H2 | **節奏錨點質性** | 第 1／3／7／14／30 天「有感」質性回歸；**不** 為此新增系統 | §4.8 |
| H3 | **首屏與儀式 IA** | 情境句優先序（`pickContextualLine`）仍像陪伴、**非** dashboard；`homeDockHint`／`attunementHint` **不** 與 Hero 情緒線同屏堆疊 | §7.3.1、`tone_of_voice.md` |
| H4 | **情緒末段與聲音策略** | 儀式 **末 5 秒** 禁新提示句與 UI 回饋音；Reduce Motion／夜晚聲音關閉行為符合 §7.4 | §7.4、`emotional_pacing.md`、`sound_direction.md` §8 |
| H5 | **量測事件名（可選）** | 僅預留 §7.3.3 事件名；**不要求** MVP 內建分析面板 | `home_open`、`ritual_countdown_complete` 等 |

#### Launch 體感補齊（依驗證缺口排優先）

| # | 項目 | 現況（摘要） | 說明 |
| --- | ---- | ------------ | ---- |
| L1 | **外部位圖／Lottie 管線** | 行動端以場景層／幾何資產落地 | 對齊 `04_FIGMA_SCOPE.md` 六屏量產；**優先** 三種 `night_sky`、寵物立繪、開箱／記憶插圖 |
| L2 | **最小聲音資產包** | **`expo-audio` 最小播放閉環** ＋ **`listening/`** 五支 WAV（`SOUND_LICENSES.md`、`sound_asset_policy.md`）；`SoundProfile` **邏輯鍵** 不變 | 儀式 **2.2s** 呼吸循環、開箱 **單次** reveal、入睡 **全靜**；首屏 **單一 ambience**（占位 `bed_home_*`）；**`sound_enabled`**／**`night_sound_enabled`** 雙開關；**Launch 前** 須替換 **正式可商用** WAV |
| L3 | **真推播營運** | mock／預覽與 `targetSleepTimeLocal` 排程錨點已有 | 真機權限、勿擾協作；文案仍走 `pushEmotionalState`，**非** 功能通知 |
| L4 | **商店包定稿** | 五圖／文案測試已有 | **真機** 截圖定稿；隱私與資料說明與 `store_copy.md` 對齊 |

#### Launch 產品決策（須拍板；前端 **不** 單方面擴 scope）

| 議題 | 說明 | 錨點 |
| ---- | ---- | ---- |
| 帳號／多裝置 | `x-device-id` → 帳號與換機進度合併 | `05_DOMAIN_AND_PERMISSIONS.md`、§0.6 E4 |
| 第 4 階與內容加量 | 是否標 Launch、是否擴夜空／夢 | §十三 順序 **2**、`game_balance_tables.md` |
| Tab／深連結／手動補登 App | Slice **不開** Tab／深連結；補登 **Launch 外** | §7.3.3、§9.2.6 |

#### Launch 前刻意排除（重申 §0.3／§十二）

微型故事、季節夢境池、NPC、Health／AI／社交；首屏再堆連勝／星塵／多條提示；儀式加新任務音或末段提示句。

**驗收：** `MVP_DEV_CHECKLIST.md` **§12**（**不** 與 §1～§11 混勾）。**§12 全勾後** 之檢核外邊界見 **§0.7**。

### 0.7 檢核收斂與後續工作邊界（v1.5.9）

**前提：** `MVP_DEV_CHECKLIST.md` **§1～§12** 已全勾；本節 **不** 新增 §0.4 系統級模組；**不** 回溯改寫 §1～§12 已勾敘事；**不** 與 §12 混勾（無新測試閘門列）。

#### 檢核表範圍內（已收斂）

| 層面 | 狀態 |
| ---- | ---- |
| **§1～§4** 可用產品必做 | 已勾 |
| **§7～§11** 專業加分、UI 深化、接軌、IA、情緒／聲音 | 已勾 |
| **§12** Launch RC 與上架前 | 已勾（**2026-05-15**：api **87**、mobile **131** 全綠；`apps/api` `tsc` 通過） |

#### RC 紀錄語意（§12 已勾 ≠ 實地驗完）

| 主題 | 檢核已達 | 仍須補強 |
| ---- | -------- | -------- |
| **Maestro** | `e2eFlow.test.ts` ＋ `acceptance/maestro_device_run.json` | **真機** 執行 `.maestro/night-flow.yaml` 並留存紀錄 |
| **§12.2 睡前驗證** | `human_sleep_validation.schema.json` ＋ `humanSleepValidation.ts` ＋ `launchRcAcceptance.test.ts` | **真人** 連續 **≥1 週** 睡前循環與 §4.8 質性回歸；`human_sleep_validation.json` **`records` 滿 7 筆**、**無** `blockingIssues` 後方可 `status: passed` |
| **整合測** | CI `release` 與本機 **須** `DATABASE_URL` | 未設時 `api.integration`／`schemaSnapshot` **skip**，**不** 視為正式驗收 |

#### Launch 後與刻意不做（須 v1.6+ 或產品決策）

| 類別 | 內容 | 錨點 |
| ---- | ---- | ---- |
| **順序 3** | 第 4 階內容量產、更多夜空／夢、季節池、微型故事試點 | §十三 順序 **3**；`launch_decisions.json` |
| **帳號／營運** | 帳號／多裝置進度合併、真推播營運後端、量測上報（`launchMetrics` 現僅事件名） | §0.6.2、`05_DOMAIN_AND_PERMISSIONS.md` |
| **體感量產** | 外部位圖／Lottie 管線、**正式 listening WAV 替換占位**、曲庫／mixer | §0.6.3 L1～L2、`visualAssetManifest.ts`、`assets/sounds/listening/`、`sound_asset_policy.md` |
| **Slice 外入口** | Tab／深連結、手動補登 App | §7.3.3、§9.2.6 |
| **刻意排除** | 微型故事、季節夢境池、NPC、Health／AI／社交 | §0.3、§十二；檢核表 **§5**、**§12.5** |

#### 文件與數值未定

| 項目 | 錨點 |
| ---- | ---- |
| 日界係數、蔫／恢復、月亮週限、掉落微調 | 附錄 A；`game_balance_tables.md` |
| 世界觀待補段落 | `GOODNIGHT_PLANET_LORE_BIBLE.md` |

**對照：** `MVP_DEV_CHECKLIST.md` **§13**（**不打勾**）。

---

## 一、產品定位

### 1.1 類型與平台

React Native（Expo）、Node.js、PostgreSQL。

### 1.2 🔥 產品定性：工具 vs IP（必選）

| 類型 | 重心 | 本專案 |
| ---- | ---- | ------ |
| **A. 工具型** | 睡眠統計、打卡效率 | **不是主軸** |
| **B. IP 型** | 世界更新、角色情感、收集敘事 | **✅ 選 B** |

**影響：** 長線重心為 **世界與內容節奏**，不是報表；商業與美術 **對齊 IP 延展**（仍可有輕統計）。

### 1.3 收藏 vs 養成

維持：**「世界在長大」**；MVP **只證明階梯有感**，不靠海量收集。

### 1.4 情緒 vs 清晰（v1.5）

情緒仍可 **文青**，但 UI **必須給數字／進度／今夜特色**，避免使用者不知道「自己做得怎樣」（§7.2）；**後端可有稀有加權，前端禁止 SSR／UR／圖鑑編號式展示**（§八）。

---

## 二、設計原則

維持：**不責備**、明示入睡、月亮守護 **關係敘事**（§2.6 v1.4）。

### 2.7 「想念」而非 guilt（新增）

久未使用時：**環境可略蔫、語氣「等你很久」**，**禁止** 羞恥與說教（對齊 **`tone_of_voice.md`**）。

---

## 三、名詞與狀態模型

### 3.1 核心名詞

| 中文 | API／程式 | 說明 |
| ---- | --------- | ---- |
| 邏輯睡眠日 | `logicalSleepDate` | 以本機日界 + `SLEEP_ROLLOVER_HOUR`（預設 5 點）映射的「這一夜」；所有結算、連勝、日狀態鍵錨點。 |
| 今夜夜空 | `nightSky` | 當晚天候原型，3 種（`clear_star`／`soft_rain`／`blue_moon`）；驅動 Forecast 與掉落權重。 |
| 夢 | `dreamKey` | 5 種（§5.10），開箱結算後寫入記憶冊。 |
| 星塵 | `stardustBalance` + `stardust_ledger` | 累加餘額 + 變動明細（reason／delta），與儀式／開箱／cancel 對齊（§5.6）。 |
| 世界成長 | `worldGrowthValue`／`worldTier` | 累加成長值映射 1～4 階；前端必須展示進度（§7.2）。 |
| 可逆牽掛 | `worldAttunement` ∈ {steady, wilted, recovering} | 久未開啟視覺略蔫、今晚回來進入 recovering；禁 guilt 文案（§2.7、§5.12）。 |

### 3.2 狀態機（夜晚）

```text
awake ──(30s 倒數完成)──> ritual_countdown_completed=true (仍 awake)
awake ──(POST /v1/sleep/start)──> sleeping
sleeping ──(POST /v1/sleep/wake)──> awake (可開箱)
sleeping ──(POST /v1/sleep/cancel)──> awake (回退成長／星塵)
awake (已 wake) ──(POST /v1/unbox)──> unboxed=true (當日結算)
```

- `sleeping` = `sleep_started_at` 非空 **且** `unboxed=false`。
- `cancel_sleep`：未按睡 → idempotent，回 `cancelled=false`；已 wake 未開箱 → 回退 start+wake 全量。

### 3.3 寵物人格原型

| 原型 key | 氣質 | 句庫策略 |
| -------- | ---- | -------- |
| `gentle`（MVP 預設） | 直白接住、慢節奏 | 晚安一句話與系統短模板皆出此原型 |
| `sleepy` / `shy` / `night_owl` | 愛睏／害羞／夜貓（Launch） | 句庫擴充時依 `tone_of_voice.md` §4 分歧 |

---

## 四、業務規則

### 4.1 「準時」

以使用者 `target_sleep_time_local` 為錨：`sleep_started_at` ≤ target + 30 分鐘 → `on_time`（成長加分，§5.12）。

### 4.2 「睡滿」

`(wake_at − sleep_started_at)` ≥ `targetSleepDurationMinutes − 60` → `goal_met`（成長加分；MVP 不顯示分數細節）。

### 4.3 連勝（streak）

- 錨點：`last_completed_logical_date`。
- 規則：當晚 `unbox` 完成時，若 `logicalSleepDate − last_completed_logical_date = 1` 則 `streak_days += 1`，否則重設為 1。
- `cancel_sleep` 後當晚未完成 unbox 不計連勝；月亮守護觸發時 **不扣** 連勝（§5.16）。

### 4.4 星塵 ledger（總則）

| reason | delta |
| ------ | ------- |
| `ritual_countdown_complete` | +1 |
| `sleep_start` | +3 |
| `sleep_wake` | +1 |
| `unbox` | +10 |
| `cancel_sleep`（僅 start） | −3 |
| `cancel_sleep`（已 wake 再撤） | −4 |

詳細見 `game_balance_tables.md` §8、`apps/api/src/stardust.ts`。

### 4.5 世界成長與連勝對齊

成長 delta 與 cancel 回退見 `game_balance_tables.md` §5；MVP 程式錨點：`sleep_start +10` / `wake +5` / `unbox +25` / `cancel −10 或 −15`。

### 4.6 `logical_sleep_date`（日界）

```text
logical_sleep_date(now) = (now − SLEEP_ROLLOVER_HOUR 小時)的本機日期
```

- 預設 `SLEEP_ROLLOVER_HOUR = 5`，可由 env 覆寫。
- 全鏈路（結算／連勝／日狀態鍵／補登）皆以此函數對齊（`apps/api/src/logicalDate.ts`）。

### 4.7 可逆牽掛（W1／W2）

- W1：以 `logical_sleep_date(now)` 與 `logical_sleep_date(last_open_at)` 的整日差 `days_since_last_open` **嚴格大於** `N1`（MVP=3）→ `wilted`。
- W2：今晚已 ritual_countdown_completed 或 sleep_started → `recovering`；其餘 → `steady`。
- 文案：見 `tone_of_voice.md` §5.2；**禁** 羞恥／指責。

### 4.8 🔥 MVP 節奏標靶（感受錨點）

數值可於 `game_balance_tables.md` 調整；**產品必須驗收「有感」**：

| 時間 | 使用者應感受到 |
| ---- | ---------------- |
| **第 1 天** | 有陪伴（人格句 + 儀式跑完） |
| **第 3 天** | 世界有小變化（至少 **階 1→2** 或同等視覺） |
| **第 7 天** | **解鎖「新」夜空體驗**（在 3 種內首次輪到加權 OR 解鎖第三種） |
| **第 14 天** | **世界升階**（達 **階 3** 或 MVP 最高階前一刻） |
| **第 30 天** | **新場景感**（Launch：第四階／新背景皮；MVP 可折衷為 **既有階段新動效**） |

若實測太慢：**優先調 `growth` 係數**，不加新系統。

---

## 五、MVP 功能規格（裁切版）

### 5.1 睡眠時間設定

- 使用者偏好：`target_sleep_time_local`、`wake_time_local`（HH:mm，本地時區字串）。
- 目標時長：後端推算 `targetSleepDurationMinutes`（跨日減去）；`PATCH /v1/me/sleep-schedule` 同時可切 `pushReminderEnabled`。
- 校驗：HH:mm regex；任一欄位 null 代表清除。

### 5.2 提醒（推播召回）

- MVP：mock payload（`apps/api/src/push/mockPush.ts`），不接外部供應商。
- 兩種 templateKey：`evening_nudge`（接近就寢前 30 分鐘）、`ritual_invite`（進入儀式）。
- 可選 query **`pushEmotionalState`**；未帶時由 **`derivePushEmotionalState`**（`pushEmotionalState.ts`）依 `worldAttunement`／久未開啟／早睡／連勝推導，與 `pickContextualLine` 優先序對齊（§7.4）。
- Payload 含 **`title`**（環境感）與 **`body`**；文案必過 `tone_of_voice.md` 黑名單；長度 ≤ 48 字。
- 推播前奏音色見 **`sound_direction.md`**；行動端 **`buildPushSoundProfile`**（`reminderSoundProfile.ts`）與 **`nightSoundscape.ts`** 決定是否播放 `push_goodnight_whisper`（對應 `listening/push_preview_soft.wav`）。

### 5.3 晚安儀式（核心路徑）

```text
開始晚安模式 → 30 秒沉浸倒數 → 使用者按「我要睡了」→ start_sleep → sleeping
```

- **禁止**：MVP 以背景／無操作自動判斷入睡（v1.3 已定）。  
- **`cancel_sleep`**：可離開流程，柔性文案（§5.20 `tone_of_voice.md`）。

### 5.4 補登、`source`、`logical_sleep_date`

- 端點：`POST /v1/sleep/manual-record`；必填 `logicalSleepDate`、`startedAt`，可選 `endedAt`、`dreamKey`。
- `sleep_records.source` 必為 `manual`（與 `unbox` 流程自動寫入的 `app` 區隔）。
- `today.lastSleepLogicalDate` 會反映最近一次 `sleep_records.logical_sleep_date`，含手動補登。

### 5.5 寵物與人格（單寵）

- Bootstrap 時建立 1 隻寵物 `pets`（`archetype='gentle'`、`display_name='小燈'`）。
- 人格決定 **晚安一句話** 輪替與 **系統短模板** 變體（§5.20、`tone_of_voice.md` §4）。
- MVP 不開命名／換寵；Launch 再加。

### 5.6 星塵 ledger（功能契約）

- 表：`stardust_ledger(user_id, logical_sleep_date, delta, reason, created_at)` + `users.stardust_balance`。
- 寫入：每次儀式／睡眠／開箱／cancel 都伴隨 ledger 列，並原子更新 `stardust_balance`。
- 對外：`/v1/today.stardustBalance`、`/v1/unbox.stardustBalance`。

### 5.7 系統短模板晚安（與晚安一句話分離）

- 端點：`GET /v1/push/template-goodnight?templateKey=evening_nudge|ritual_invite`（可選 `pushEmotionalState`）。
- 句庫：`templateGoodnight.ts` 之 `pushTemplatePayload` 依 **`pushEmotionalState` × `archetype`** 出短句與 **`title`**。
- 與 `goodnightLines.ts`（§5.20）**互斥分離**，避免推播文案與當晚顯示句重複。

### 5.8 輕統計（非報表主軸）

`/v1/today` 暴露：

| 欄位 | 說明 |
| ---- | ---- |
| `streakDays` | 連勝（§4.3） |
| `nightsCompleted` | 累計完成夜數 |
| `lastCompletedLogicalDate` | 最近一次 unbox 完成日 |
| `lastSleepLogicalDate` | 最近一次 `sleep_records`（含 manual） |

不做圖表與週報；保持 IP 定性（§1.2）。

### 5.9 今天結束儀式（可選路徑）

- 端點：`POST /v1/ritual/day-closure`，body `{ action: 'complete' | 'skip' }`。
- 寫入：`daily_states.day_closure_completed` / `day_closure_skipped`，**同鍵 `logical_sleep_date`**。
- 與主晚安流並行：**不阻擋** `/v1/sleep/start`。

### 5.10 晚安開箱 × 記憶冊（5 種夢）

- 端點：`POST /v1/unbox`；前置條件：當日 `daily_states` 存在、`unboxed=false`。
- 結算：依當晚 `night_sky_state_key` 查 `DROP_WEIGHTS`（加 `early_bed` 倍率）抽 `dreamKey`；寫入 `memory_entries(narrative)` 以「今晚記住了：…」開頭。
- 後續：更新 `users.world_growth_value += 25`、重算 `world_tier`、連勝、`stardust_balance += 10`；補寫 `sleep_records(source='app')`。
- 重複：第二次呼叫回 `400 { error: 'already_unboxed' }`。

### 5.11 季節夢境（❌ MVP → ✅ Launch／LiveOps）

**季節池** 需 **營運節奏與池維護**，**不進 MVP**；MVP 只用 **固定少量夢類型 + 夜空加權**。

---

### 5.12 夜晚世界成長（MVP：**3～4 階**）

#### 成長值

- `world_growth_value` 累積；係數見 **`game_balance_tables.md`**。

#### MVP 階梯（示例：僅 **4 階**上限）

| 階 | 敘事（示例） |
| --- | ------------- |
| 1 | 小屋微光 |
| 2 | 窗邊植物萌芽 |
| 3 | 夜空流星 |
| 4（可標 Launch） | 更亮場景／遠景層（**非 NPC**） |

**行動端展示（v1.5.11）：** `TonightProgressPanel` 階梯 **僅亮 1～3 格**（`MAX_WORLD_TIER_VISIBLE = 3`）；`users.world_tier`／`world_growth_value` **仍** 可達第 4 階；世界結算畫面敘事可含第 4 階，**不** 於首屏進度條預設展示第 4 格。

**移除 MVP：**「夜晚居民／NPC 訪客」——改 **Launch**。

#### 🔥 可逆牽掛（非懲罰）

若 **`last_active_logical_date`** 早於閾值（天數由平衡表定）：

- **視覺：** 植物略垂、燈光稍暗（**可恢復**）。  
- **文案：**「我們等你好久了」「小屋也想你了」——**禁止**「你又失敗」類（見 `tone_of_voice.md`）。

**資料：** `users.last_open_at`、`world_attunement` 或簡化為 **規則計算**（見 balance 表）。

---

### 5.13 期待感循環（MVP）

**今夜夜空** → **晚安一句話** → 儀式 → 入睡 → 開箱 → **世界成長** → 記憶冊。

---

### 5.14 今夜夜空（MVP：**少種類、強規則**）

- **3 種夜空**起（Slice）。  
- **耦合**：`night_sky` → forecast 呈现 → drop 权重大 → 背景；**一律寫入 `game_balance_tables.md`**，避免 oral 乱改。

---

### 5.16 月亮守護（敘事版、限次）

- 端點：`GET /v1/moon-guard/status`、`POST /v1/moon-guard/trigger`。
- 限制：每 **ISO 週** 1 次（`moon_guard_usage(user_id, iso_week, uses)`），重複觸發回 `{ ok: false, error: 'on_cooldown' }`。
- 文案：見 `userFacingStrings.ts` `MOON_GUARD_MESSAGES`；**禁** 施捨／寬限券語氣（`GOODNIGHT_PLANET_LORE_BIBLE.md` §6）。

### 5.17 新手期（onboarding phases）

| phase | 條件 |
| ----- | ---- |
| `first_night` | `nights_completed == 0` |
| `first_week` | `0 < nights_completed < 7` |
| `settled` | `nights_completed >= 7` |

`/v1/today.onboardingPhase` 暴露；前端據此調整 UI 強度（如儀式說明）。

### 5.18 小屋等你／想念敘事

- `/v1/today.homeDockHint`：依 `worldAttunement` + `attunementHint` 組合短句。
- 禁 guilt（`tone_of_voice.md` §5.2）；`toneCompliance.test.ts` 守門。

### 5.19 早睡限定（不開季節池）

- 端點：`POST /v1/daily/early-bed { earlyBed: boolean }`，寫 `daily_states.early_bed_for_dream`。
- 結算：`rollDream` 時若 `earlyBed=true`，`aurora_hint` weight × `EARLY_BED_AURORA_MULTIPLIER`（**1.5**）；其餘條目不變，**不引入** 季節池。

---

### 5.20 晚安一句話（✅ MVP）vs 微型故事（❌ Launch）

| 模式 | MVP | Launch |
| ---- | ----- | ------ |
| **晚安一句話** | **1 句／晚**，人格化輪替，成本低 | 持續擴句庫 |
| **儀式後一句夢境回饋** | 倒數結束後 **`postRitualDreamLine`** 單句（人格池、決定性輪替）；**非** 連載／劇情線 | Launch 後可 A/B；**不** 升格為故事系統 |
| **微型故事** | **不做** | 30s 文本管線、配音、分享卡 |

---

### 5.21 每日期待（MVP 最小組）

1. 夜空不同  
2. 開箱／夢  
3. 世界進度 **看得見**  

**不含：** 訪客 NPC、季節活動。

---

## 六、使用者流程（v1.5）

```text
進入夜晚 → 小屋／寵物／單一情緒線／主 CTA
→ （掃讀）今夜夜空一行 + 儀式一句；（可展開）進度細節
→ 開始晚安儀式 → 倒數 + 呼吸光 →「我要睡了」→ sleeping → wake_up
→ （可選，收合入口）今天收工
→ 開箱 → 記憶冊 → 世界成長／階段
```

---

## 七、畫面與資訊架構

### 7.1 MVP 畫面

同前精神；**移除「微型故事頁」**。

### 7.2 🔥 清晰進度（禁止抽象到底）

**原則：** 使用者須能辨識「今夜夜空」與「今晚儀式走到哪」；**預設首屏** 維持 **陪伴感**，**不得** 呈現工具型 dashboard（§7.3）。

| 層次 | 元素 | 說明 |
| ---- | ---- | ---- |
| **預設掃讀** | **今夜夜空** | 一行：`今晚：{nightSky.displayName}`（或等價敘事，**禁** SSR／UR／圖鑑編號） |
| **預設掃讀** | **儀式一句** | 一行：儀式狀態敘事（例：**還差一步，把燈慢慢關上**）；**禁** 完成度 % |
| **展開後** | **今晚儀式完成度** | 例：倒數 ✓／按下睡了 ✓ |
| **展開後** | **連勝** | 明確數字 + `logical_sleep_date` 語境；**禁** 首屏與情緒線並列 |
| **展開後** | **世界進度** | **%** 或 **下一階還差 ○○**；`attunementHint`、稀有度 **敘事 tag** 同區 |
| **展開後** | **Forecast 全文** | `forecastSummary` 與邏輯日顯示 |

### 7.3 睡前首屏與儀式 IA（v1.5.6）

**一句核心：** 打開 App，像回到 **有人替你留燈的小屋**——**不是** 功能總覽或養成 dashboard。

#### 7.3.1 TonightHome（首屏）

| 區塊 | 規則 |
| ---- | ---- |
| **Hero** | **小屋場景**、**寵物立繪**、**單一情緒線**（引號一句）、**單一主 CTA**（開始晚安儀式／睡醒開箱／已開箱靜態句） |
| **TonightProgressPanel** | **預設收合**；**常駐** §7.2 兩行掃讀；**展開** 後才見 checklist、連勝、世界 %、`AttunementKit` |
| **次要旅程** | **今天收工**、記憶冊、睡眠設定、月亮守護 → **可收合**「小屋裡還有」；**禁** 首屏多 Ghost 並列；**禁** 另開「更多」頁或 Tab |
| **情緒線** | **全屏僅一句**；`homeDockHint`、`attunementHint`、星塵、新手 **不得** 與 Hero 情緒線同屏堆疊（`attunementHint` 僅 **展開** 進度區） |

**情境句優先序（`pickContextualLine`；高→低）：**

1. **儀式狀態**（`ritual_state`）：`unboxed`／`sleeping`／`sleepStarted`／`ritualCountdownCompleted`  
2. **寵物情緒**：`worldAttunement` **recovering**  
3. **寵物情緒**：`worldAttunement` **wilted**  
4. **寵物情緒**：`daysSinceLastOpenLogical` ≥ 2（missed_you）  
5. **寵物情緒**：`nightsCompleted` === 0（first_night）  
6. **寵物情緒**：`earlyBedForDream`（early_bed）  
7. **寵物情緒**：`streakDays` ≥ 3（steady_rhythm）  
8. **進度提示**：`homeDockHint`（有值）  
9. **fallback**：`goodnightLine`（後端）或 **人格原型** 核心句庫（每原型 **5～8** 句；**聽得出差異** 優於句量）

人格句氣質對齊 **`tone_of_voice.md` §4**；禁止 guilt／說教／醫療口吻。

#### 7.3.2 RitualCountdown（儀式）

| 允許 | 禁止 |
| ---- | ---- |
| **30s 倒數**（`RitualTimer`）、**BreathingGlow**、倒數結束後 **「我要睡了」**、**離開**（`cancel_sleep` 柔性語氣）、倒數歸零後 **`postRitualDreamLine`** 單句（**非** 新任務音） | 設定、記憶冊、月亮守護等 **次入口**；儀式 **步驟 checklist**；**SyncStatusBar**／**LogicalDateHint** 於儀式 phase |

**邊界：** 須 `countdown-complete` 後方可 `sleep/start`（§5.3）；**不做** 自動入睡偵測。

#### 7.3.3 動效、無障礙、導覽

| 主題 | 規則 |
| ---- | ---- |
| **Reduce Motion** | 尊重系統 **減少動態**；常駐 loop（寵物浮動、呼吸光）**可靜態化** |
| **無障礙** | 主 CTA、倒數、**今晚細節**展開具 `accessibilityLabel`／`expanded`；倒數與主按鈕支援 **系統大字級**（`maxFontSizeMultiplier`） |
| **Tab／深連結** | **MVP／Slice 不開**；維持 **單主線** Stack |
| **量測（Launch 後）** | 僅 **預留事件名**：`home_open`、`home_start_ritual_tap`、`ritual_countdown_complete`、`ritual_sleep_start`、`ritual_cancel`、`home_secondary_expand`、`home_details_expand`；**不要求** MVP 內建分析面板 |

**實作錨點：** `apps/mobile` — `TonightHome.tsx`、`TonightProgressPanel.tsx`、`tonightGlanceCopy.ts`、`pickContextualLine.ts`、`postRitualDreamLine.ts`、`progressLayout.ts`、`VerticalSliceApp.tsx`（`phase === 'ritual'`）、`useReducedMotion.ts`。

### 7.4 情緒節奏與聲音人格（v1.5.7；播放閉環 v1.5.10；體感收斂 v1.5.11）

**一句話：** 字、動、聲、推播共用同一條情緒強度曲線——見 **`emotional_pacing.md`**、**`sound_direction.md`**。

| 主題 | 規則 |
| ---- | ---- |
| **Phase pacing** | `emotionalPacing.ts` 定義 Home／Ritual／Sleeping／Unbox 等 **字／動／聲** 預算 |
| **儀式末 5 秒** | **禁** 新提示句與 **UI confirm** 音；呼吸層 **降音量**（極淡空氣感）；呼吸光可保留（Reduce Motion 下可靜態） |
| **推播人格** | `pushEmotionalState` × 四原型；標題像環境、內文像同伴；**目標是「想回去」** |
| **SoundProfile** | `soundProfile.ts` 依原型材質與 pacing 輸出 **邏輯資產鍵**；**不** 因換檔改 API |
| **In-app 播放** | `expo-audio`：`nightSoundscapePlayback.ts` → `nightSoundscapePlayer.ts` ← `useNightSoundscape.ts`；**`nightSoundscape.ts` 維持純函式 intent** |
| **Phase 聲音** | **Home**：**單一** `bed_home_*` ambience loop（占位對應 `listening/`；**禁** 旋律曲庫）；**Ritual**：`ritual_breath_*` 約 **2.2s**；**Sleeping**：**全靜**；**Unbox**：`reveal_unbox` **單次** |
| **聲音開關** | **`sound_enabled`**（App 內總開關）＋ **`night_sound_enabled`**（夜晚聲音與推播前奏；須總開關開啟）；睡眠設定兩枚 Switch；關閉時 in-app 床層／儀式／reveal／推播前奏 **全靜**（UI 點擊音亦受總開關約束） |
| **背景** | App 進 **背景** 停播；`shouldPlayInBackground: false` |
| **Reduce Motion／靜音** | 與 §7.3.3 同表檢核：動效可靜，**節拍性 pulse 關**；夜晚聲音關則 UI／床／推播前奏 **全關** |

**實作錨點：** `apps/api` — `pushEmotionalState.ts`、`templateGoodnight.ts`、`push/loadPushToneContext.ts`；`apps/mobile` — `emotionalPacing.ts`、`soundProfile.ts`、`nightSoundscape.ts`、`nightSoundscapePlayback.ts`、`nightSoundscapePlayer.ts`、`useNightSoundscape.ts`、`nightSoundPreferences.ts`、`reminderSoundProfile.ts`、`push/pushEmotionalState.ts`、`VerticalSliceApp.tsx`、`RitualTimer.tsx`、`push/reminders.ts`、`assets/sounds/listening/`、`assets/sounds/SOUND_LICENSES.md`；**`docs/sound_asset_policy.md`**。

---

## 八、美術風格與 IP 呈現（🔥 v1.5.1）

### 8.1 總則

詳細 **禁止／允許／動效** 見 **`art_direction.md`**（與本節 **強綁定**）。**蔫／恢復** 狀態需 **同一套色調**，避免「懲罰暗黑色」。

### 8.2 「收集」的 UI：記憶冊，不是圖鑑

| 禁止（易 Pokémon／卡牌化） | 改為（回憶收藏冊） |
| -------------------------- | ------------------ |
| 編號 NO.001、空格「未發現」 | **日期 + 一句話情境**（例：**今晚記住了：一場偏藍的月光**） |
| SSR／UR／閃卡框、稀有度大字報 | **敘事 tag**：較少見、今晚雲薄（後端 weight 可保留，**展示層敘事化**） |
| 集齊進度條壓迫感 | **輕量章節／相簿感**，可留白 |

### 8.3 寵物外型：繪本療癒，非對戰生物

- **適合**：毛線／毛氈、睡帽、枕頭、小夜燈、柔軟輪廓、簡化表情。  
- **避免**：高辨識對戰剪影、大頭身圓眼演化感、元素符號化「属性」。  

### 8.4 行銷與商店定位

- **主軸**：**情緒陪伴、晚安儀式、安心結束今天**。  
- **避免**：「收集 100 種夢獸」「Sleep Companion **Collection**」為視覺主標——易滑向 **creature collection**。  
- 差異化資產在 **原創世界 + 語氣 + 夜晚系統**；長線防線是 **團隊一致的規範文件**（Lore／Tone／Art／Balance），而非單點「避開任天堂」。

### 8.5 法律與品牌備忘（非法律意見）

「睡眠 + 養成」**概念**不可壟斷；風險常在 **具體表現是否混淆**。本專案以 **情緒定位與原創敘事** 與既有 IP 區隔；**最大風險**反而是 **自家產品後期長歪**——故 **美術／UI／文案規範** 必須早期固定。

---

## 九、技術架構與耦合治理

### 9.1 技術棧

同前。

### 9.2 🔥 規則引擎與耦合

下列 **高度耦合**，不得散落在聊天裡改：

`night_sky` → `forecast` → `drop_weight` → `collectible` → `world_growth` → `background`

**唯一數值與機率入口：** **`game_balance_tables.md`**（與 DB seed／後台常數對齊）。

### 9.3 API 端點清單（v0.2 合約，與 `contracts/openapi.yaml` 同步）

| 方法 | 路徑 | 摘要 |
| ---- | ---- | ---- |
| GET | `/health` | Liveness |
| POST | `/v1/bootstrap` | 建立／解析裝置使用者 |
| GET | `/v1/today` | 今夜首屏（夜空／進度／世界／牽掛／onboarding／月亮守護／星塵） |
| PATCH | `/v1/me/sleep-schedule` | 就寢／起床／推播偏好 |
| POST | `/v1/daily/early-bed` | 早睡限定旗標 |
| GET | `/v1/moon-guard/status` | 本週守護用量 |
| POST | `/v1/moon-guard/trigger` | 觸發守護（週限 1） |
| GET | `/v1/push/reminder-preview` | 推播召回 mock |
| GET | `/v1/push/template-goodnight` | 系統短模板 |
| POST | `/v1/ritual/countdown-complete` | 30s 倒數完成 |
| POST | `/v1/ritual/day-closure` | 可選「今天結束儀式」 |
| POST | `/v1/sleep/start` | 我要睡了 |
| POST | `/v1/sleep/wake` | 起床 |
| POST | `/v1/sleep/cancel` | 撤銷今晚入睡 |
| POST | `/v1/sleep/manual-record` | 手動補登 |
| GET | `/v1/memory-entries` | 記憶冊條目 |
| POST | `/v1/unbox` | 起床後開箱 |

### 9.4 錯誤碼與柔性文案契約

| HTTP | error | 何時 | 備註 |
| ---- | ----- | ---- | ---- |
| 400 | `invalid_body` | zod 校驗失敗 | 不夾雜業務語氣 |
| 400 | `invalid_query` | 查詢字串列舉失敗 | 同上 |
| 400 | `no_daily_state` | 當日 daily_states 未生成 | 通常呼叫 `/today` 後即修復 |
| 400 | `already_unboxed` | 重複 unbox | `unbox` 端點 |
| 400 | `cannot_cancel` | unbox 後再 cancel | 帶柔性 `message` |
| 401 | `missing_or_unknown_device` | 缺或未知 `x-device-id` | bootstrap 後再試 |
| 200 | `on_cooldown`（在 body.error） | 月亮守護本週已用 | `ok=false` |

所有帶 `message` 的回應，文案必過 `toneCompliance.test.ts` 黑名單（**禁** 「失敗／活該／丟臉／你又不／沒救了」）。

---

## 十、資料表設計（v1.5.2，對齊 migrations/001～006）

### 10.1 核心表（最終欄位）

```text
users(
  id UUID PK,
  device_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  last_open_at TIMESTAMPTZ,
  streak_days INT NOT NULL DEFAULT 0,
  world_growth_value INT NOT NULL DEFAULT 0,
  world_tier INT NOT NULL DEFAULT 1 CHECK (world_tier BETWEEN 1 AND 4),
  nights_completed INT NOT NULL DEFAULT 0,
  last_completed_logical_date DATE,
  stardust_balance INT NOT NULL DEFAULT 0,
  target_sleep_time_local TEXT,
  wake_time_local TEXT,
  push_reminder_enabled BOOLEAN NOT NULL DEFAULT false
)

pets(id, user_id UNIQUE 1:1, archetype TEXT DEFAULT 'gentle', display_name TEXT DEFAULT '小燈')

night_sky_definitions(key PK, display_name, rarity, forecast_summary)  -- 002 seed

daily_states(
  id, user_id, logical_sleep_date DATE,
  night_sky_state_key TEXT FK,
  ritual_countdown_done BOOLEAN,
  ritual_countdown_completed BOOLEAN,        -- 003
  sleep_started_at, wake_at, unboxed BOOLEAN,
  day_closure_completed, day_closure_skipped, -- 004
  early_bed_for_dream BOOLEAN,                -- 006
  UNIQUE (user_id, logical_sleep_date)
)

sleep_records(id, user_id, logical_sleep_date, source TEXT, started_at, ended_at, dream_key)
memory_entries(id, user_id, logical_sleep_date, dream_key, night_sky_key, narrative, created_at)

stardust_ledger(id, user_id, logical_sleep_date, delta INT, reason TEXT, created_at)   -- 005
moon_guard_usage(user_id, iso_week TEXT, uses INT CHECK 0..1, PK(user_id, iso_week))    -- 006
```

### 10.2 Migration 對照

| # | 檔名 | 摘要 |
| - | ---- | ---- |
| 001 | `001_init.sql` | 初始 7 表 |
| 002 | `002_seed_balance.sql` | 夜空 3 種 seed |
| 003 | `003_ritual_countdown_completed.sql` | 倒數完成獨立欄位 |
| 004 | `004_day_closure_light_stats.sql` | 今天結束儀式欄位 |
| 005 | `005_stardust_ledger.sql` | 星塵餘額 + ledger |
| 006 | `006_moon_sleep_early.sql` | 月亮守護 + 偏好 + 早睡旗標 |

### 10.3 季節表（明確排除）

MVP **不把**季節表塞進必要路徑；早睡僅作用於固定 `DROP_WEIGHTS` × multiplier，**不引入** `seasons` 表（§5.19、§0.3）。

---

## 十一、商業模式（規劃）

**IP 型**：長線 **世界更新、皮膚、季節 LiveOps**（Launch+）；MVP **不接**完整 LiveOps。

---

## 十二、未來功能（非 MVP）

- 微型故事系統、季節夢境池、NPC 訪客  
- Health、AI、社交  

---

## 十三、開發優先順序

| 順序 | 內容 |
| ---- | ---- |
| **0** | **Vertical Slice**（§0.5） |
| **1** | 儀式、`logical_sleep_date`、3 夜空、5 夢、3～4 階世界、開箱、ledger、月亮守護、進度 UI、`game_balance_tables.md` v0 |
| **2** | Launch 內容加量（第 4 階、更多夜空夢、季節池、微型故事試點）——**須** 順序 **2f**／§12 通過後再排；細項見順序 **3** |
| **2b** | **可用→專業加分**（§0.6）：視覺主線 → App 次要 API 接線 → 可靠／時區 → 上架與 CI；**不** 取代 §0.2 必做 |
| **2c** | **前端 UI 深化**（§0.6.1、`MVP_DEV_CHECKLIST.md` §8）：§7 全勾後之場景資產、動效、IA 收斂與上架截圖 |
| **2d** | **前後端接軌後續**（§0.6.2、`MVP_DEV_CHECKLIST.md` §9）：client 契約、日界 SSOT、輕統計進 UI、契約級測試；**不** 取代 §1～§8 已勾項 |
| **2e** | **睡前 IA 與情緒節奏**（§7.3～§7.4、`MVP_DEV_CHECKLIST.md` §10～§11）：首屏 IA 收斂、**`emotional_pacing.md`／`sound_direction.md`**、推播人格化與行動端 pacing／聲音策略；**不** 新增 §0.4 系統級模組 |
| **2f** | **Launch RC 與上架前**（§0.6.3、`MVP_DEV_CHECKLIST.md` §12）：RC 工程閘門 → 真人睡前驗證 → Launch 體感補齊 → 產品決策邊界；**不** 新增 §0.4 系統級模組 |
| **3** | **Launch 內容加量**（§十三 順序 **2**）：第 4 階、更多夜空夢、季節池、微型故事試點——**須** §12 RC／驗證通過後再排；**須** v1.6+ 與產品決策；細項見 **§0.7**、檢核表 **§13** |

**現況（2026-05-15）：** 順序 **0**、**1**、**2b**～**2f** 已納入檢核表 **§1～§12** 並全勾；**現行主軸** 為 **§0.7** 真機／真人補強與順序 **3** 排程（**不** 回溯塞進 §12）。

---

## 十四、上架與營運（輕量）

**Launch 前：** 檢核表 **§12** 已勾；上架前仍須依 **§0.7** 完成 **真機** Maestro、**真人** 睡前驗證與商店素材定稿；IP 型需注意 **描述用語**（非醫療），對照 `store_copy.md` 與 `marketingCopy.test.ts`。

**Launch 後：** 真推播營運、量測事件名質性回歸（§7.3.3）；帳號／多裝置與 LiveOps 類能力 **不** 回溯塞進 MVP 主線；見 **§0.7**、§十三 順序 **3**。

---

## 十五、需求追溯（v1.5.2）

| 需求 | 章節／檔案 |
| ---- | ---------- |
| 範圍凍結 | §0.4 |
| MVP／Launch | §0.2～0.3 |
| Vertical Slice | §0.5 |
| IP 定性 | §1.2 |
| 節奏錨點 | §4.8 |
| 世界 3～4 階、可逆牽掛 | §5.12、§4.7 |
| 晚安一句話 | §5.20 |
| 進度 UI | §7.2、§7.3 |
| 睡前 IA 收斂 | §7.3、`01_UX_FLOW.md`、`02_UI_FLOW.md` |
| 情緒節奏與聲音人格 | §7.4、`emotional_pacing.md`、`sound_direction.md`、`MVP_DEV_CHECKLIST.md` §11 |
| 規則集中 | §9.2、`game_balance_tables.md` |
| API 端點清單／錯誤碼 | §9.3、§9.4、`contracts/openapi.yaml` |
| 資料表（含 migrations 001～006） | §十 |
| 語氣 | `tone_of_voice.md` |
| IP 呈現／美術 | §八、`art_direction.md` |
| 可用→專業加分 | §0.6、`MVP_DEV_CHECKLIST.md` §7 |
| 前端 UI 深化 | §0.6.1、`MVP_DEV_CHECKLIST.md` §8 |
| 前後端接軌稽核／後續 | §0.6.2、`MVP_DEV_CHECKLIST.md` §9 |
| 睡前 IA 收斂 | §7.3、`MVP_DEV_CHECKLIST.md` §10 |
| 情緒節奏與聲音人格 | §7.4、`MVP_DEV_CHECKLIST.md` §11 |
| Launch RC 與上架前 | §0.6.3、`MVP_DEV_CHECKLIST.md` §12 |
| 檢核收斂與後續邊界 | §0.7、`MVP_DEV_CHECKLIST.md` §13 |

---

## 十六、世界觀資產與 Lore Bible

同 v1.4；文案遵守 **`tone_of_voice.md`**；**視覺與動效**遵守 **`art_direction.md`**。

---

## 附錄 A：未定案（數值）

1. 日界、`growth` 係數、蔫／恢復天數  
2. 月亮守護週限  
3. 掉落表（見 **`game_balance_tables.md`**）

---

## 附錄 B：關聯文件（與本版強綁）

下表為與本版 **強綁定** 之核心檔案；**同屬 `docs/`**（本機示例：`C:\GOODNIGHT_PLANET\docs`）**之其餘檔案**——如開發檢核、UX／UI 與 Figma 範圍、網域權限等——**亦為實作與對齊之參考來源**，請依職責併讀，勿僅依本規格書與下表四檔。

| 檔案 | 用途 |
| ---- | ---- |
| `GOODNIGHT_PLANET_LORE_BIBLE.md` | 世界觀 SSOT |
| **`game_balance_tables.md`** | **數值／機率／耦合規則** |
| **`tone_of_voice.md`** | **品牌語氣、禁止與允許** |
| **`art_direction.md`** | **美術／UI／動效／記憶冊呈現、行銷視覺紅線** |
| **`emotional_pacing.md`** | **情緒節奏（字／動／聲／推播）跨模態規格** |
| **`sound_direction.md`** | **聲音人格、夜晚材質、推播前奏與靜音策略** |
| **`sound_asset_policy.md`** | **音檔授權、占位替換、雙開關與 MVP 聲音範圍** |
| **`apps/mobile/assets/sounds/SOUND_LICENSES.md`** | **listening 音檔來源、授權與可商用邊界** |

---

## 附錄 C：API 合約（`contracts/openapi.yaml`）

| 版本 | 範圍 |
| ---- | ---- |
| v0.1 | Vertical Slice 7 端點（bootstrap／today／ritual countdown／sleep start/wake／unbox／health） |
| **v0.2**（現行） | 補齊 17 端點（含 `me/sleep-schedule`、`daily/early-bed`、`moon-guard/*`、`push/*`、`ritual/day-closure`、`sleep/cancel`、`sleep/manual-record`、`memory-entries`）；同步 §9.3／§9.4 |

OpenAPI 變動時，**必須** 一併更新：

1. 本檔 §9.3、§9.4。
2. `docs/MVP_DEV_CHECKLIST.md` 對應行（§1～§4、§7～§11 測試閘門）。
3. `apps/api/test/api.integration.test.ts` 之斷言。
4. `docs/MVP_DEV_CHECKLIST.md` **§12**（若影響 Launch RC 閘門）。
5. `docs/MVP_DEV_CHECKLIST.md` **§13**（若影響檢核外邊界敘事；**不打勾**）。

---

*Goodnight Planet MVP 規格書 v1.5.11*
