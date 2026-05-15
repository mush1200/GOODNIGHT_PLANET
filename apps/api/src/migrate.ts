import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const MIGRATIONS_DIR = path.join(__dirname, '..', 'migrations');

async function ensureMigrationsTable(client: pg.Client): Promise<void> {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
}

async function appliedMigrations(client: pg.Client): Promise<Set<string>> {
  const r = await client.query<{ name: string }>(`SELECT name FROM schema_migrations`);
  return new Set(r.rows.map((row) => row.name));
}

export async function runMigrations(connectionString: string): Promise<void> {
  const client = new pg.Client({
    connectionString,
    ssl:
      process.env.DATABASE_SSL === 'true' ||
      (process.env.DATABASE_SSL !== 'false' && connectionString.includes('supabase.co'))
        ? { rejectUnauthorized: false }
        : undefined,
  });

  await client.connect();
  await ensureMigrationsTable(client);
  const done = await appliedMigrations(client);

  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    if (done.has(file)) {
      console.log('[migrate] skip', file);
      continue;
    }
    const sql = readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
    console.log('[migrate] running', file);
    await client.query('BEGIN');
    try {
      await client.query(sql);
      await client.query(`INSERT INTO schema_migrations (name) VALUES ($1)`, [file]);
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    }
  }

  await client.end();
  console.log('[migrate] complete');
}

async function main(): Promise<void> {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('[migrate] DATABASE_URL is required');
    process.exit(1);
  }
  await runMigrations(url);
}

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isMain) {
  main().catch((err) => {
    console.error('[migrate] failed:', err);
    process.exit(1);
  });
}
