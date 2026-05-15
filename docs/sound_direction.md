# 晚安星球 Goodnight Planet｜聲音方向（Sound Direction）v0.1

| 項目 | 說明 |
| ---- | ---- |
| 對齊規格 | MVP v1.5.7 |
| 狀態 | **強制參考**：UI 回饋音、儀式環境、開箱 reveal、推播前奏與 `SoundProfile` 實作皆應對照本檔 |
| 並讀 | `tone_of_voice.md`、`art_direction.md`、`emotional_pacing.md` |

**一句話：** 聲音像有人替你留燈——是夜晚材質，不是功能通知。

---

## 1. 品牌聲音哲學

- **陪伴感優先**：聲音進入情緒系統，不比 UI 次要。
- **夜晚材質**：一套低刺激材質（木、布、暖燈、空氣），**不是** BGM 曲庫或遊戲音效包。
- **人格可辨**：同一操作在四原型下應能 **盲聽分辨**（與 `tone_of_voice.md` §4 對齊）。

---

## 2. 禁止事項（❌）

| 類型 | 說明 |
| ---- | ---- |
| 遊戲 UI | 明亮 click、硬回彈、抽卡爆光、開卡金光 |
| 科幻夜貓 | night_owl **禁** cyber／電子主音色；主世界仍療癒，僅更空靈、窗邊感 |
| 任務感 | 倒數最後 5 秒 **禁** 新 UI 音；推播 **禁** 系統預設「提醒」音色 |
| 刺激 | 強高頻、長尾轟鳴、驚喜爆炸粒子式音效 |

---

## 3. 人格音色（四原型）

| 原型 | 材質 | UI | Ritual | Reveal |
| ---- | ---- | ---- | ---- | ---- |
| **gentle** | 棉被、木頭、暖燈 | 輕木質 click；低頻不刺耳；短尾 | 呼吸 air；微弱風鈴；柔和低頻 pulse | 柔光翻開記憶冊 |
| **sleepy** | 棉花、慢、鈍 | 「pof」棉感；更 muffled、更短 | 更懶、更低解析的 breath | 更小、更短的溫暖驚喜 |
| **shy** | 門邊、留燈 | **更輕、更遠**；幾乎無 attack | 極輕 air；少節拍 | 幾乎無聲的柔光 |
| **night_owl** | 深夜窗邊、夜風 | 高頻較薄；有空間殘響 | 輕風、遠處城市空氣感 | 空靈短尾，非科幻 |

**檢核：** 隨機抽 10 次主 CTA／儀式進入，是否 **聽得出誰在場**。

---

## 4. 場景聲音（對齊 App phase）

| Phase | 目標 | 允許 | 禁止 |
| ---- | ---- | ---- | ---- |
| **Home** | 被接住 | 極淡床（可關） | 循環旋律、多層疊加 |
| **Ritual** | 慢慢安靜 | 與 `BreathingGlow` **同週期**（約 2.2s）的 breath／pulse | 步驟音、通知感 |
| **Ritual 末 5s** | 幾乎無語 | 僅空氣感 | UI click、新句提示音 |
| **Sleeping** | 放空 | 近靜音 | 任何節拍 |
| **Unbox** | 小驚喜 | 柔光／翻頁感 | 爆光、慶祝 |
| **Memory／World** | 安靜滿足 | 短尾、不慶祝 | 圖鑑／升級式音效 |

---

## 5. 動效聲音

| 事件 | 原則 |
| ---- | ---- |
| **click** | 短於 120ms；夜間預設音量低於日間 UI 慣例 |
| **reveal** | 與 `SoftUnboxGlow` 同步；單次、非 loop |
| **transition** | phase 切換短 crossfade；禁 whoosh |

實作錨點：`apps/mobile` — `soundProfile.ts`、`nightSoundscape.ts`（純函式 intent）、`nightSoundscapePlayback.ts`、`nightSoundscapePlayer.ts`、`useNightSoundscape.ts`、`reminderSoundProfile.ts`、`nightSoundPreferences.ts`。

---

## 6. 推播聲音

- **氣質**：不像系統通知，而像 **夜晚傳來一句話** 的前奏。
- **標題**：環境感（例：「小屋裡還亮著燈」），**不是** 功能名。
- **內文**：依 `pushEmotionalState` × 寵物原型；與 in-app `goodnightLine` **分離**（§5.7）。
- **音色**：自訂 `goodnight_whisper`（極短、可關）；預設 **不** 使用系統大聲提醒音。

---

## 7. 音量原則

- 夜間 **低刺激**；與就寢錨、勿擾模式協作。
- 使用者可在睡眠設定關閉 **夜晚聲音**（環境床與 UI 回饋）；推播可獨立開關。

---

## 8. Reduce Motion／Silent 對應

| 模式 | 動效 | 聲音 |
| ---- | ---- | ---- |
| **Reduce Motion** | 常駐 loop 可靜（§7.3.3） | **節拍性 pulse 關**；極淡床可留 |
| **夜晚聲音關** | 不變 | UI／儀式／床 **全關** |
| **推播靜音** | — | `shouldPlaySound: false`；僅橫幅 |

---

## 9. MVP 最小資產包（listening）

**路徑：** `apps/mobile/assets/sounds/listening/`；授權見 **`SOUND_LICENSES.md`**。  
**原則：** `SoundProfile` **邏輯鍵** 不變；`soundPack.ts` 對應至 listening 檔，**可替換 WAV 不改 playback API**。**不** 以曲庫數量驗收。

| listening 檔 | 對應邏輯鍵（摘要） | 用途 |
| ---- | ---- | ---- |
| `ui_confirm_soft.wav` | `ui_confirm_{archetype}` | 主 CTA（儀式末 5 秒 **禁**） |
| `ritual_breath_soft.wav` | `ritual_breath_{archetype}` | 儀式呼吸（約 **2.2s**；末 5 秒 **降音量**） |
| `reveal_unbox_soft.wav` | `reveal_unbox` | 開箱 **單次** reveal |
| `transition_soft.wav` | `transition_soft` | phase 切換（非旋律 loop） |
| `push_preview_soft.wav` | `push_goodnight_whisper` | 推播前奏 |

**Home 極淡 ambience：** 專用 `bed_home_*` **未** 納入 listening 最小包；掛載前 **維持靜音**，避免旋律 loop。

---

## 10. 修訂紀錄

| 版本 | 日期 | 摘要 |
| ---- | ---- | ---- |
| v0.2 | 2026-05-15 | listening 五檔、`expo-audio` 閉環、`SOUND_LICENSES.md`；對齊 v1.5.10 §7.4 |
| v0.1 | 2026-05-14 | 初稿；對齊 v1.5.7 聲音人格與 `SoundProfile` |
