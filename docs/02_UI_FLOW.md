# 晚安星球｜UI Flow（資訊架構與導覽）

對齊 `GOODNIGHT_PLANET_MVP_SPEC.md` v1.5.6 §七、§0.5 Vertical Slice、§7.3。

## 畫面地圖（MVP Slice）

```text
                    ┌─────────────────┐
                    │   TonightHome   │
                    │ 小屋·寵物·一句·  │
                    │ 掃讀兩行·主 CTA  │
                    └────────┬────────┘
                             │ 開始晚安儀式
                             ▼
                    ┌─────────────────┐
                    │  RitualCountdown │
                    │ 倒數·呼吸·睡了·離開│
                    └────────┬────────┘
                   cancel │  │「我要睡了」
                          ▼  ▼
               ┌──────────┐  ┌──────────┐
               │  Home    │  │ Sleeping │
               │ (返回)   │  │ (極簡)   │
               └──────────┘  └────┬─────┘
                                  │ wake
                                  ▼
                    ┌─────────────────┐
                    │   UnboxReveal   │
                    │ 夢類型·敘事      │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  MemorySnippet  │
                    │ 今日記憶冊條目   │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  WorldProgress  │
                    │ 階段·成長·返回今夜│
                    └─────────────────┘
```

## 導覽策略（Slice）

- **Stack**：TonightHome → RitualCountdown → Sleeping → UnboxReveal → MemorySnippet → WorldProgress → pop 回 TonightHome。
- **Tab bar**：**不開**；單一主線即可（§7.3.3）。
- **深度連結**：Launch 再開；Slice 省略。
- **TonightHome 次入口**：**可收合**「小屋裡還有」（收工、記憶冊、睡眠設定、月亮守護）；**禁** 獨立「更多」頁。

## 首屏必備元件（§7.2、§7.3）

| 區塊 | 內容 |
| ---- | ---- |
| **Hero** | 小屋場景、寵物立繪、**單一**情緒線、**單一**主 CTA |
| **掃讀（預設可見）** | `今晚：{nightSky.displayName}`；儀式狀態一句（**非** %／連勝 dashboard） |
| **展開「今晚細節」** | Forecast 全文、儀式 checklist、連勝、世界進度、`attunementHint`、**敘事化稀有標籤**（非 SSR） |
| **收合「小屋裡還有」** | 次旅程 Ghost 入口（預設 **不** 展開） |

## 儀式畫面（RitualCountdown）

| 允許 | 禁止 |
| ---- | ---- |
| `RitualTimer`、`BreathingGlow`、「我要睡了」、離開 | 步驟 checklist、設定／記憶冊／守護入口、儀式 phase 之同步列／邏輯日提示 |

## 文案與資產約束

- 稀有度：`tone_of_voice.md` §8、`art_direction.md` §4。
- 取消睡眠：`tone_of_voice.md` §5.1。
- 動效：`art_direction.md` §3（慢、呼吸、不閃爍）；**Reduce Motion** 見 §7.3.3。

## Figma／實作對應

設計稿 FRAME 清單見 `docs/04_FIGMA_SCOPE.md`。名詞與權限對照見 `docs/05_DOMAIN_AND_PERMISSIONS.md`。
