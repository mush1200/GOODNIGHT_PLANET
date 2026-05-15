# Figma 範圍清單（Vertical Slice）

供設計師對齊 `docs/02_UI_FLOW.md`；元件須使用 Design Token（色／字級／間距）。IA 收斂見 `GOODNIGHT_PLANET_MVP_SPEC.md` **§7.3**。

## Frames（建議命名）

1. **TonightHome** — 小屋場景、寵物、**單一**情緒線、**單一**主 CTA；**TonightProgressPanel** 預設 **兩行掃讀** + 可展開「今晚細節」；**可收合**「小屋裡還有」（次入口，預設關）。
2. **RitualCountdown** — 30s 倒數、呼吸光、「我要睡了」、離開（**無** checklist／次導覽）。
3. **Sleeping** — 極簡停留／提示起床。
4. **UnboxReveal** — 夢類型揭示（敘事標題，無稀有度框）。
5. **MemorySnippet** — 今日記憶冊（日期 + 一句 + 插圖位）。
6. **WorldProgress** — 階段名稱、進度條或 %、返回今夜。

## 元件庫（最小）

- Button / GhostButton、Card、Tag（敘事用）、ProgressRing 或線性進度、Timer、**可收合區塊**（今晚細節／小屋裡還有）。

## 檢核（上架／大版本）

對照 `art_direction.md` §5、`tone_of_voice.md` §7；首屏 **禁** 療癒文字牆與 dashboard 式預設版面（§7.3）。
