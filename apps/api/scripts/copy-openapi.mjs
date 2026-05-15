import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const apiRoot = path.join(scriptDir, '..');
const destDir = path.join(apiRoot, 'dist');
const dest = path.join(destDir, 'openapi.yaml');

const candidates = [
  path.join(apiRoot, 'contracts', 'openapi.yaml'),
  path.join(apiRoot, '..', '..', 'contracts', 'openapi.yaml'),
];

const src = candidates.find((p) => existsSync(p));
if (!src) {
  console.error('[build] openapi.yaml not found. Expected one of:');
  for (const p of candidates) console.error('  -', p);
  process.exit(1);
}

mkdirSync(destDir, { recursive: true });
copyFileSync(src, dest);
console.log(`[build] copied ${path.relative(apiRoot, src)} -> dist/openapi.yaml`);
