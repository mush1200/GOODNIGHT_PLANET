# Goodnight Planet｜Sound Asset Policy

| 項目 | 說明 |
| ---- | ---- |
| 對齊 | `sound_direction.md`、`apps/mobile/assets/sounds/SOUND_LICENSES.md` |
| 版本 | v0.1 |
| 狀態 | Launch 前占位與正式素材皆須遵守 |

## 禁止

- 未授權音樂、遊戲拆包、YouTube 抓音、未標示來源的樣本庫。
- 以 AI 即時生成之睡前音樂作為正式上架素材。
- 占位 WAV 直接進正式版商店包（須替換並更新授權表）。

## 允許

- 專案自製、CC0、或已購買商用授權之素材。
- 程序化合成占位（見 `scripts/generate-sound-pack.mjs`），上架前須替換或確認授權。

## 每個音檔須記錄

- 檔名與 `soundProfile` 邏輯鍵對照。
- 來源與授權類型。
- 是否可商用、是否需標示作者。

## MVP 聲音範圍

- 點擊音、reveal 音、儀式呼吸、推播前奏、首屏單一 ambience 底聲。
- **不做** 曲庫、mixer、音色選擇。

## 開關

- `sound_enabled`：App 內聲音總開關。
- `night_sound_enabled`：夜晚聲音與推播前奏；須在總開關開啟時才生效。

## 替換流程

1. 新增或替換 `assets/sounds/listening/*.wav`。
2. 更新 `SOUND_LICENSES.md` 與本檔清單。
3. 跑 `soundPackMount.test.ts`、`nightSoundscapePlayback.test.ts` 與相關契約測試。
