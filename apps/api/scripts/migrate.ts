import 'dotenv/config';
import { runMigrations } from '../src/migrate.js';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('[migrate] DATABASE_URL is required');
  process.exit(1);
}

runMigrations(url).catch((err) => {
  console.error('[migrate] failed:', err);
  process.exit(1);
});
