import 'dotenv/config';
import pg from 'pg';

/**
 * 連到系統庫 `postgres`，建立 PGDATABASE（預設 GOODNIGHT_PLANET）。
 * 不依賴 DATABASE_URL 的目標庫——避免「庫尚未存在」時無法連線。
 */
const host = process.env.PGHOST ?? 'localhost';
const port = Number(process.env.PGPORT ?? 5432);
const user = process.env.PGUSER ?? 'postgres';
const password = process.env.PGPASSWORD ?? '123456';
const targetDb = process.env.PGDATABASE ?? 'GOODNIGHT_PLANET';

async function main() {
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
