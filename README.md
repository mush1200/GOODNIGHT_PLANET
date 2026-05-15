# Goodnight Planet（開發倉）

對齊 `docs/GOODNIGHT_PLANET_MVP_SPEC.md` v1.5.5 與關聯文件。

本資料夾已用 **robocopy** 對 Cursor 工作區做過 **完整鏡像**（含 `apps/*/node_modules`、`package-lock.json`、`assets` 等）。同步摘要見 `_FULL_SYNC_LOG.txt`（約 2.8 萬個檔、~350 MB）。**未複製** 來源端的 `.git`（若之後要版控，請在 `C:\GOODNIGHT_PLANET` 自行 `git init`）。

## 結構

| 路徑 | 說明 |
| ---- | ---- |
| `docs/01_UX_FLOW.md` … `05_DOMAIN_AND_PERMISSIONS.md` | UX／UI／Moodboard／Figma／領域與權限 |
| `contracts/openapi.yaml` | API 契約（Vertical Slice） |
| `apps/api` | Node.js + PostgreSQL |
| `apps/mobile` | Expo（React Native） |

## 本機執行

### 1. 資料庫

複製範例設定並**自行填入**（repo 內不含任何真實密碼）：

```bash
copy apps\api\.env.example apps\api\.env
# 編輯 apps\api\.env：至少設定 DATABASE_URL（或 PGPASSWORD + PGDATABASE）
```

若 PostgreSQL 尚無目標庫，先建立再 migration：

```bash
cd apps\api
npm install
npm run db:create
npm run migrate
npm run dev
```

`npm run db:create` 會連到系統庫 `postgres`，依 `.env` 的 `PGDATABASE`（預設 `GOODNIGHT_PLANET`）建立資料庫；已存在則略過。

預設 API：`http://localhost:3333`。

**API 文件（Swagger / OpenAPI）：**

| 用途 | URL |
| ---- | --- |
| 互動式文件（Swagger UI） | `http://localhost:3333/docs` |
| OpenAPI 原始檔（YAML） | `http://localhost:3333/openapi.yaml` |
| OpenAPI 原始檔（JSON） | `http://localhost:3333/openapi.json` |
| Android 模擬器 | `http://10.0.2.2:3333/docs`（loopback 到 host） |
| 區網裝置／實機 | `http://<電腦區網 IP>:3333/docs`（需與 `EXPO_PUBLIC_API_URL` 同網段） |

規格來源：`contracts/openapi.yaml`（v0.2，17 端點），server 啟動時讀檔；改完 yaml 直接 reload 頁面即可。

### 2. App

**Node.js 請用 20.19.4 或以上**（Expo 54 / React Native 0.81 官方要求）。若暫時無法升級、且遇到 `configs.toReversed is not a function`，專案已內建 `patch-package` 對 `metro-config` 的修補；`npm install` 後會自動套用 `apps/mobile/patches/`。

若 `apps/mobile/assets` 缺少 Expo 預設圖示，請在 **PowerShell** 執行專案根目錄的 `SYNC_ASSETS_FROM_CURSOR.ps1`（內含 Cursor 工作區路徑，可依你的環境修改）。

```bash
cd apps\mobile
npm install
npm start
```

- **Android 模擬器**：預設 `10.0.2.2:3333`（已在 client 處理）。**Windows 須先安裝 Android Studio**（內含 SDK），預設路徑多為 `C:\Users\<你>\AppData\Local\Android\Sdk`。若不在預設路徑，請設使用者環境變數 **`ANDROID_HOME`**（或 **`ANDROID_SDK_ROOT`**）指向 SDK 根目錄，並把 `%ANDROID_HOME%\platform-tools` 加進 **PATH**（內含 `adb`），重新開啟終端機後再 `npm start` 並按 `a`。
- **Android 實機（免本機 SDK）**：手機安裝 **Expo Go**，與電腦同一 Wi‑Fi，用 `npm start` 掃 QR；若要打 API，請設 `EXPO_PUBLIC_API_URL=http://<電腦區網IP>:3333`。
- **iOS 模擬器**：僅 macOS；API 預設 `127.0.0.1:3333`。
- **iOS 實機**：請設定 `EXPO_PUBLIC_API_URL`（電腦區網 IP + port）。

### 邏輯日（Slice）

後端以 **`USER_TIMEZONE`（預設 `Asia/Taipei`）** 與 **`SLEEP_ROLLOVER_HOUR`（預設 5）** 計算 `logical_sleep_date`：`(now − rollover 小時)` 的本機日期（見 `apps/api/src/logicalDate.ts`、規格 §4.6）。行動端 `LogicalDateHint` 與 `timezone.ts` 對齊同一日界敘事。

## Vertical Slice 流程

 bootstrap → 今夜首屏 → 30s 儀式 →「我要睡了」→ 睡醒開箱 → 記憶句／成長。
