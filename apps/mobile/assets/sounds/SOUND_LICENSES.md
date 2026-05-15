# Goodnight Planet｜Sound Licenses

| 項目 | 說明 |
| ---- | ---- |
| 範圍 | `assets/sounds/listening/` 最小睡前聲音包 |
| 狀態 | 工程占位；上架前可替換正式 WAV，**鍵名與 playback API 不變**；政策見 `docs/sound_asset_policy.md` |

## 授權原則

- 僅使用 **專案自行生成** 或 **可商用、可上架** 之素材。
- **禁止** 未知來源、遊戲拆包、YouTube 抓音、未授權樣本庫。
- 現行 `listening/` 檔案由 `scripts/generate-sound-pack.mjs` **程序化合成**，無第三方取樣。

## 檔案清單

| 檔名 | 來源 | 授權類型 | 可商用 | 需標示作者 |
| ---- | ---- | -------- | ------ | ---------- |
| `ui_confirm_soft.wav` | 專案程序化生成（`generate-sound-pack.mjs`） | 專案原創 | 是 | 否 |
| `ritual_breath_soft.wav` | 專案程序化生成（`generate-sound-pack.mjs`） | 專案原創 | 是 | 否 |
| `reveal_unbox_soft.wav` | 專案程序化生成（`generate-sound-pack.mjs`） | 專案原創 | 是 | 否 |
| `transition_soft.wav` | 專案程序化生成（`generate-sound-pack.mjs`） | 專案原創 | 是 | 否 |
| `push_preview_soft.wav` | 專案程序化生成（`generate-sound-pack.mjs`） | 專案原創 | 是 | 否 |

## Profile 鍵對照

`soundProfile` 仍輸出 `ui_confirm_{archetype}`、`ritual_breath_{archetype}`、`reveal_unbox`、`push_goodnight_whisper` 等 **邏輯鍵**；`soundPack.ts` 將其對應至 `listening/` 檔案，未來替換 WAV 時 **不需改動** intent／profile 架構。
