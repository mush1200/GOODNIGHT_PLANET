import type { Express } from 'express';
import type { Pool } from 'pg';
import type { AppEnv } from './env.js';
import { verifyDatabaseConnection } from './db.js';

export async function startServer(app: Express, pool: Pool, env: AppEnv): Promise<void> {
  if (env.trustProxy) {
    app.set('trust proxy', 1);
  }

  await verifyDatabaseConnection(pool);

  const base =
    env.publicApiUrl ??
    (process.env.RAILWAY_PUBLIC_DOMAIN
      ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
      : `http://0.0.0.0:${env.port}`);

  await new Promise<void>((resolve, reject) => {
    const server = app.listen(env.port, '0.0.0.0', () => {
      console.log(`[server] Goodnight Planet API listening on 0.0.0.0:${env.port} (${env.nodeEnv})`);
      console.log(`[server] health       ${base}/health`);
      console.log(`[server] Swagger UI   ${base}/docs`);
      console.log(`[server] OpenAPI YAML ${base}/openapi.yaml`);
      resolve();
    });
    server.on('error', (err) => {
      console.error('[server] failed to bind port:', (err as NodeJS.ErrnoException).message);
      reject(err);
    });
  });
}

export function registerProcessHandlers(pool: Pool): void {
  process.on('unhandledRejection', (reason) => {
    console.error('[process] unhandledRejection:', reason);
  });
  process.on('uncaughtException', (err) => {
    console.error('[process] uncaughtException:', err);
    process.exit(1);
  });

  const shutdown = async (signal: string) => {
    console.log(`[server] ${signal} — closing database pool`);
    try {
      await pool.end();
    } catch (err) {
      console.error('[server] pool shutdown error:', err);
    }
    process.exit(0);
  };
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));
}
