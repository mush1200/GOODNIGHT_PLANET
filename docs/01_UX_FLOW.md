# 晚安星球｜UX Flow（Vertical Slice）

對齊 `GOODNIGHT_PLANET_MVP_SPEC.md` v1.5.6 §0.5、§六、§7.3。

## 目標與範圍（Slice）

| 項目 | Slice 上限 |
| ---- | ---------- |
| 寵物 | 1 隻、1 種人格 |
| 夜空 | 3 種（`clear_star` / `soft_rain` / `blue_moon`） |
| 夢類型 | 5 種 |
| 世界階段 | 3 階（第 4 階可標 Launch） |

## 主旅程（睡前 → 起床）

### A. 進入夜晚（首屏）

1. 使用者開啟 App，進入「今夜」狀態（非入睡中）。
2. **Hero** 僅感知：**小屋場景**、**寵物**、**單一情緒線**、**主 CTA**（開始晚安儀式／睡醒開箱）。
3. **TonightProgressPanel** **預設收合**，常駐 **兩行掃讀**：今夜夜空一行（例：`今晚：細雨綿綿`）、儀式狀態一句（例：`儀式：還差一步，把燈慢慢關上`）；**展開** 後才見 Forecast 全文、儀式 checklist、連勝、世界進度、`attunementHint` 與稀有度敘事 tag。
4. **情境句** 全屏 **僅一句**；優先序見規格 **§7.3.1**（`pickContextualLine`）。**禁止** `homeDockHint`、`attunementHint`、星塵、新手文案與情緒線 **同屏堆疊**。
5. **次要旅程**（今天收工、記憶冊、睡眠設定、月亮守護）收在 **可收合**「小屋裡還有」；**不** 另開「更多」頁或 Tab。

### B. 晚安儀式（核心路径）

1. 進入儀式 → **30 秒倒數** + **呼吸光**（沉浸，可顯示剩餘秒數）；**不** 顯示同步列、邏輯日提示或次要導覽。
2. 倒數結束：**「我要睡了」** → 觸發 `start_sleep` → 狀態 `sleeping`（須先 `countdown-complete`，§5.3）。
3. **取消**：離開儀式 → `cancel_sleep`，語氣允許退路，禁止 guilt（`tone_of_voice.md` §5.1）。

### C. 入睡中 → 起床

1. `sleeping` 期間介面可極簡（勿自動偵測入睡，規格 §5.3）。
2. 起床動作：**睡醒／開箱**入口 → `wake_up`。

### D. 起床後：開箱 → 記憶冊 → 世界成長

1. **晚安開箱**：依 `night_sky` 與平衡表決定夢類型（5 種之一），展示敘事句與小插圖位。
2. **記憶冊**：登錄條目（日期 + 情境一句），**禁止**圖鑑編號／SSR 語彙（`art_direction.md` §4）。
3. **世界成長**：顯示成長／階段變化（3～4 階中之 Slice 範圍）；進度在 **展開** 進度區或起床後世界畫面 **可辨**（§7.2）。

## 次要／Slice 可簡化

- **月亮守護**：敘事版、週限一次——經 **收合** 入口進入；非首屏並列。
- **可逆牽掛（蔫）**：久未開啟時環境略蔫；**情緒線** 優先 `wilted`／`recovering` 句庫，**視覺** 與 `attunementHint` 在 **展開** 區成套呈現。

## 錯誤與邊界（UX）

- 無網路：儀式與本地倒數仍可跑，同步延後提示（**儀式中不顯示** 同步列，見 §7.3.2）。
- 補登／`logical_sleep_date`：Slice 可先走「正常流程」；補登入口列 backlog。
- **Reduce Motion**：系統開啟減少動態時，常駐 loop 動效應收斂（§7.3.3）。

## 成功指標（對齊 §4.8 感受錨點）

產品驗收時對照：第 1／3／7／14／30 天「有感」與規格錨點；數值由 `game_balance_tables.md` 調整，不新增系統。

**Launch 後量測（僅事件名規劃）：** `home_open`、`home_start_ritual_tap`、`ritual_countdown_complete`、`ritual_sleep_start`、`ritual_cancel`、`home_secondary_expand`、`home_details_expand`。
