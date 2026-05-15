import 'dotenv/config';
import pg from 'pg';
import { loadPgAdminConfig } from '../src/loadPgConfig.js';

/**
 * 連到系統庫 `postgres`，建立 PGDATABASE。
 * 憑證僅來自 `DATABASE_URL` 或 `PGPASSWORD`（見 `.env.example`）。
 */
async function main() {
  const { host, port, user, password, targetDb } = loadPgAdminConfig();

  const admin = new pg.Client({
    host,
    port,
    user,
    password,
    database: 'postgres',
  });
  await admin.connect();

  const exists = await admin.query<{ exists: boolean }>(
    `SELECT EXISTS(SELECT 1 FROM pg_database WHERE datname = $1) AS exists`,
    [targetDb],
  );
  if (exists.rows[0]?.exists) {
    console.log(`Database "${targetDb}" already exists.`);
    await admin.end();
    return;
  }

  const safe = targetDb.replace(/"/g, '""');
  await admin.query(`CREATE DATABASE "${safe}"`);
  console.log(`Created database "${targetDb}".`);
  await admin.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
