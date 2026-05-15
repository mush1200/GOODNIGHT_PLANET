# Railway 部署指南 — Goodnight Planet API

本文件說明如何將 `apps/api` 部署到 [Railway](https://railway.app)，資料庫使用 [Supabase](https://supabase.com) PostgreSQL，行動端透過 `EXPO_PUBLIC_API_URL` 連線。

## 架構概覽

| 元件 | 位置 |
| ---- | ---- |
| API | Railway（`apps/api`） |
| PostgreSQL | Supabase |
| Mobile | Expo（本機／EAS，讀 `EXPO_PUBLIC_API_URL`） |

## 1. Supabase 資料庫

1. 建立 Supabase 專案。
2. 進入 **Project Settings → Database**。
3. 複製 **Connection string → URI**（建議選 **Session mode** 或 **Transaction pooler**，依連線數需求）。
4. 確認 URI 含 `?sslmode=require`（Supabase 預設會帶）。

此字串即 Railway 的 `DATABASE_URL`。

> 首次部署前可在 Supabase SQL Editor 手動執行 migration，或交由 API `npm start` 自動執行（見下方 Start Command）。

## 2. Railway 建立服務

1. [Railway Dashboard](https://railway.app/dashboard) → **New Project** → **Deploy from GitHub repo**（或 CLI）。
2. 選擇本 repo。
3. **Settings → Root Directory** 設為：

   ```text
   apps/api
   ```

   Railway 只會在此目錄執行 build／start；`npm run build` 會把根目錄的 `contracts/openapi.yaml` 複製到 `dist/`。

### Build Command

```bash
npm install && npm run build
```

（若使用 Nixpacks 預設，通常等同於偵測到 `package.json` 後執行 `npm run build`。）

### Start Command

```bash
npm start
```

等同於：

```bash
node dist/migrate.js && node dist/index.js
```

啟動時會：

1. 對 `DATABASE_URL` 執行尚未套用的 SQL migration（`schema_migrations` 追蹤，可安全重複 deploy）。
2. 啟動 Express，監聽 `0.0.0.0` 與 `process.env.PORT`（Railway 自動注入）。

### Health Check

在 Railway 服務 **Settings → Healthcheck**（若有）設為：

- Path: `/health`
- 預期回應：`{"ok":true}`

## 3. Railway Variables

在服務 **Variables** 新增（參考 repo 根目錄 `.env.example`，**勿**將真實值寫入 repo）：

| Variable | 必填 | 說明 |
| -------- | ---- | ---- |
| `DATABASE_URL` | 是 | Supabase PostgreSQL URI |
| `NODE_ENV` | 是 | `production`（staging 可設 `staging`） |
| `JWT_SECRET` | 建議 | 預留未來認證；請用強隨機字串 |
| `PORT` | 否 | Railway 自動注入，勿寫死 |
| `PUBLIC_API_URL` | 建議 | 例如 `https://<service>.up.railway.app`（啟動 log 用） |
| `CORS_ORIGINS` | 選填 | 逗號分隔，Expo Web／管理後台網域 |
| `SLEEP_ROLLOVER_HOUR` | 選填 | 預設 `5` |
| `USER_TIMEZONE` | 選填 | 預設 `Asia/Taipei` |

Railway 會自動提供 `RAILWAY_PUBLIC_DOMAIN`；CORS 亦允許 `*.railway.app`。

**不要**在 production 設定 `PGHOST`／本機 Postgres 變數。

### Staging 環境

建議另開一個 Railway 服務（或 Environment）：

- `NODE_ENV=staging`
- 獨立的 Supabase 專案或 staging schema 的 `DATABASE_URL`
- Mobile staging：`.env` 內 `EXPO_PUBLIC_API_URL=https://<staging>.up.railway.app`

## 4. 部署與重新部署

**首次／推送 deploy**

- 連接 GitHub 後，push 到預設分支即觸發 build。
- 或 Dashboard → **Deploy** → **Redeploy**。

**手動重新 deploy**

- Railway 服務頁 → **Deployments** → 選最新部署 → **Redeploy**。

**查看 logs**

- 服務頁 → **Deployments** → 點選部署 → **View Logs**。
- 啟動成功應看到：
  - `[migrate] complete` 或 `[migrate] skip ...`
  - `[db] connected`
  - `[server] Goodnight Planet API listening on 0.0.0.0:...`

**啟動失敗常見原因**

| Log | 處理 |
| --- | ---- |
| `DATABASE_URL is required` | 在 Variables 設定 Supabase URI |
| `[db] connection failed` | 檢查 URI、Supabase IP 允許、SSL |
| `[migrate] failed` | 在 Logs 看 SQL 錯誤；必要時於 Supabase 修復後 Redeploy |
| `Invalid PORT` | 勿覆寫 Railway 的 `PORT` 為非數字 |

## 5. 測試 API

將 `<RAILWAY_URL>` 換成 Railway 產生的 HTTPS 網域（或 `PUBLIC_API_URL`）。

```bash
curl -s https://<RAILWAY_URL>/health
# {"ok":true}

curl -s https://<RAILWAY_URL>/openapi.yaml | head

curl -s -X POST https://<RAILWAY_URL>/v1/bootstrap \
  -H "Content-Type: application/json" \
  -d '{"deviceId":"deploy-smoke-test-001"}'
```

瀏覽器開啟 Swagger：`https://<RAILWAY_URL>/docs`

## 6. Mobile 連線

在 `apps/mobile/.env`（或 EAS Secrets）設定：

```env
EXPO_PUBLIC_API_URL=https://<RAILWAY_URL>
```

重新啟動 Expo（`npx expo start -c` 清快取）。原生 App 不受 CORS 限制；Expo Web 需在 `CORS_ORIGINS` 加入對應網域。

## 7. 本機對照

| 環境 | API | Mobile |
| ---- | --- | ------ |
| 本機 | `apps/api/.env` + `npm run dev` | 預設模擬器 host；實機設 LAN IP |
| Production | Railway Variables | `EXPO_PUBLIC_API_URL` → Railway HTTPS |

詳見 `apps/api/.env.example` 與根目錄 `.env.example`。
