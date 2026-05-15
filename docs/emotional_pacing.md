# 晚安星球 Goodnight Planet｜情緒節奏規格（Emotional Pacing）v0.1

| 項目 | 說明 |
| ---- | ---- |
| 對齊規格 | MVP v1.5.7 §7.4 |
| 狀態 | **強制參考**：字、動、聲、推播與 onboarding 節奏應對照本檔 |
| 並讀 | `01_UX_FLOW.md`、`02_UI_FLOW.md`、`tone_of_voice.md`、`art_direction.md`、`sound_direction.md` |

**一句話：** 同一主線上，情緒強度曲線一致——功能可複製，體感靠 pacing。

---

## 1. Phase 情緒強度

| Phase | 情緒目標 | 強度 0–3 | 字 | 動 | 聲 |
| ---- | ---- | ---- | ---- | ---- | ---- |
| **Home** | 被接住 | 1 | 全屏 **一句**（`pickContextualLine`） | 寵物微表演；Hero 不堆 dashboard | 極淡床；輕 UI |
| **Ritual 前段** | 慢慢安靜 | 2 | 一句提示 | `BreathingGlow` 主導 | 呼吸材質 |
| **Ritual 末 5s** | 幾乎無語 | 0 | **禁新句**；hint 收斂 | 光略收 | **禁 UI click**；僅空氣 |
| **Sleeping** | 放空 | 0 | 極少 | 近靜態 | 近靜音 |
| **Unbox** | 小驚喜 | 1 | 敘事一句 | 柔光擴散 | 翻頁感；禁爆音 |
| **Memory** | 安靜滿足 | 1 | 日期＋情境 | 慢 | 短尾 |
| **World** | 安靜滿足 | 1 | 階段敘事 | 慢、不閃 | 不慶祝 |

實作錨點：`apps/mobile` — `emotionalPacing.ts`、`derivePetMicroPerformance.ts`、`BreathingGlow.tsx`。

---

## 2. 首屏情緒輸入（與 `pickContextualLine` 同序）

高→低：`recovering` → `wilted` → `missed_you` → `first_night` → `early_bed` → `steady_rhythm` → `home_dock` → `fallback`。

**推播** 使用同源 `pushEmotionalState`（不含 `first_night`／`home_dock`／`fallback`），見規格 §5.7。

---

## 3. 三條硬規則

1. **同屏情緒單線**：情緒線與 `homeDockHint`、星塵、新手 **不得** 同屏堆疊（§7.3.1）。
2. **儀式神聖區**：僅倒數、呼吸光、我要睡了、離開；**禁** 次入口與同步列（§7.3.2）。
3. **數值敘事化**：連勝／% 僅 **展開** 後；禁首屏冷數字搶陪伴感（§7.2）。

---

## 4. 推播節奏（非提醒）

| `pushEmotionalState` | 氣質 | 目標 |
| ---- | ---- | ---- |
| `recovering` | 小屋重新亮燈 | 想回去 |
| `wilted` | 安靜想念 | 想回去 |
| `missed_you` | 久未開啟 | 想回去 |
| `early_bed` | 稀有夜空感 | 溫柔收工 |
| `steady_companion` | 穩定陪伴 | 維持節奏 |
| `steady` | 日常晚安 | 維持節奏 |

**禁止**：「該睡了」式教官句；與當晚 in-app 晚安句 **重複**。

---

## 5. Reduce Motion／Silent

見 `sound_direction.md` §8；動效與聲音 **同一張表** 檢核，避免各做各的。

---

## 6. 驗收（質性）

- 儀式末 5 秒：無新任務感文案／音效。
- Unbox：無 gacha／SSR 聯想。
- 推播預覽：像 **夜晚一句話**，不像功能通知。
- Launch 事件名（§7.3.3）可對照 phase 強度做質性回歸。

---

## 7. 修訂紀錄

| 版本 | 日期 | 摘要 |
| ---- | ---- | ---- |
| v0.1 | 2026-05-14 | 初稿；對齊 v1.5.7 §7.4 |
