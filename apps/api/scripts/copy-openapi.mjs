import { copyFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const apiRoot = path.join(root, '..');
const src = path.join(apiRoot, '..', '..', 'contracts', 'openapi.yaml');
const destDir = path.join(apiRoot, 'dist');
const dest = path.join(destDir, 'openapi.yaml');

mkdirSync(destDir, { recursive: true });
copyFileSync(src, dest);
console.log('[build] copied openapi.yaml -> dist/openapi.yaml');
