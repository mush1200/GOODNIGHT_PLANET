import 'dotenv/config';

export type AppEnv = {
  nodeEnv: string;
  port: number;
  databaseUrl: string;
  jwtSecret: string | undefined;
  isProduction: boolean;
  corsOrigins: string[];
  trustProxy: boolean;
  publicApiUrl: string | undefined;
};

/** Reserved for future auth — never hardcode; set via env only. */
export function getJwtSecret(): string | undefined {
  const value = process.env.JWT_SECRET?.trim();
  return value || undefined;
}

function parsePort(raw: string | undefined): number {
  const port = Number(raw ?? process.env.PORT);
  if (!Number.isFinite(port) || port <= 0) {
    throw new Error(`Invalid PORT: ${raw ?? '(empty)'}`);
  }
  return port;
}

function parseCorsOrigins(): string[] {
  const fromEnv = process.env.CORS_ORIGINS?.split(',').map((s) => s.trim()).filter(Boolean) ?? [];
  const extras = [process.env.RAILWAY_PUBLIC_DOMAIN, process.env.PUBLIC_API_URL]
    .filter((v): v is string => Boolean(v))
    .map((v) => (v.startsWith('http') ? v : `https://${v}`));
  return [...new Set([...fromEnv, ...extras])];
}

export function loadEnv(): AppEnv {
  const nodeEnv = process.env.NODE_ENV ?? 'development';
  const isProduction = nodeEnv === 'production' || nodeEnv === 'staging';

  if (isProduction && !process.env.DATABASE_URL) {
    console.error(`[startup] DATABASE_URL is required when NODE_ENV=${nodeEnv}`);
    process.exit(1);
  }

  const jwtSecret = getJwtSecret();
  if (isProduction && !jwtSecret) {
    console.warn('[startup] JWT_SECRET is not set (required before enabling JWT auth)');
  }

  let port: number;
  try {
    port = parsePort(process.env.PORT);
  } catch (err) {
    console.error('[startup]', (err as Error).message);
    process.exit(1);
  }

  const databaseUrl = process.env.DATABASE_URL ?? '';
  if (!databaseUrl && isProduction) {
    console.error('[startup] DATABASE_URL is required');
    process.exit(1);
  }

  return {
    nodeEnv,
    port,
    databaseUrl,
    jwtSecret,
    isProduction,
    corsOrigins: parseCorsOrigins(),
    trustProxy: process.env.TRUST_PROXY !== 'false',
    publicApiUrl: process.env.PUBLIC_API_URL?.replace(/\/$/, ''),
  };
}
