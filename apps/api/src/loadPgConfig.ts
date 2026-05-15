/**
 * Local tooling (db:create) — credentials only from env, never hardcoded.
 */
export type PgAdminConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  targetDb: string;
};

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    console.error(`[config] Missing required env: ${name}`);
    process.exit(1);
  }
  return value;
}

export function loadPgAdminConfig(): PgAdminConfig {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (databaseUrl) {
    let parsed: URL;
    try {
      parsed = new URL(databaseUrl);
    } catch {
      console.error('[config] DATABASE_URL is not a valid URL');
      process.exit(1);
    }
    const password = parsed.password ? decodeURIComponent(parsed.password) : '';
    if (!password) {
      console.error('[config] DATABASE_URL must include a password (or use PG* vars)');
      process.exit(1);
    }
    const dbFromPath = parsed.pathname.replace(/^\//, '');
    return {
      host: parsed.hostname,
      port: Number(parsed.port || 5432),
      user: decodeURIComponent(parsed.username || 'postgres'),
      password,
      targetDb: process.env.PGDATABASE?.trim() || dbFromPath || requireEnv('PGDATABASE'),
    };
  }

  return {
    host: process.env.PGHOST?.trim() || 'localhost',
    port: Number(process.env.PGPORT ?? 5432),
    user: process.env.PGUSER?.trim() || 'postgres',
    password: requireEnv('PGPASSWORD'),
    targetDb: process.env.PGDATABASE?.trim() || requireEnv('PGDATABASE'),
  };
}
