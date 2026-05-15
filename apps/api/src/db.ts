import pg from 'pg';
import type { AppEnv } from './env.js';

/** Supabase / managed Postgres typically require TLS. */
export function createPool(env: AppEnv): pg.Pool {
  const connectionString = env.databaseUrl;
  if (!connectionString) {
    return new pg.Pool();
  }

  const useSsl =
    process.env.DATABASE_SSL === 'true' ||
    (process.env.DATABASE_SSL !== 'false' &&
      (connectionString.includes('supabase.co') ||
        connectionString.includes('sslmode=require') ||
        env.isProduction));

  const pool = new pg.Pool({
    connectionString,
    ssl: useSsl ? { rejectUnauthorized: false } : undefined,
    max: Number(process.env.PG_POOL_MAX ?? 10),
  });

  pool.on('error', (err) => {
    console.error('[db] unexpected pool error:', err.message);
  });

  return pool;
}

export async function verifyDatabaseConnection(pool: pg.Pool): Promise<void> {
  if (!pool.options.connectionString) {
    console.warn('[db] DATABASE_URL not set — skipping connection check');
    return;
  }
  try {
    await pool.query('SELECT 1');
    console.log('[db] connected');
  } catch (err) {
    console.error('[db] connection failed:', (err as Error).message);
    throw err;
  }
}
