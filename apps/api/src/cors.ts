import type { CorsOptions } from 'cors';
import type { AppEnv } from './env.js';

const RAILWAY_HOST = /\.railway\.app$/i;
const EXPO_HOST = /\.(expo\.dev|exp\.direct)$/i;

function originAllowed(origin: string, env: AppEnv): boolean {
  // development + staging: permissive for QA; production enforces list
  if (env.nodeEnv !== 'production') return true;

  if (env.corsOrigins.some((allowed) => origin === allowed || origin.startsWith(`${allowed}/`))) {
    return true;
  }
  if (RAILWAY_HOST.test(origin) || EXPO_HOST.test(origin)) {
    return true;
  }
  try {
    const { hostname } = new URL(origin);
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return process.env.ALLOW_LOCALHOST_CORS === 'true';
    }
  } catch {
    return false;
  }
  return false;
}

export function buildCorsOptions(env: AppEnv): CorsOptions {
  return {
    origin(origin, callback) {
      // React Native / Expo native, curl, server-to-server — no Origin header
      if (!origin) {
        callback(null, true);
        return;
      }
      if (originAllowed(origin, env)) {
        callback(null, true);
        return;
      }
      console.warn('[cors] blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  };
}
