import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

function pngDimensions(bytes: Buffer): { width: number; height: number } {
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

describe('store screenshots (8.4.1)', () => {
  it('ships portrait screenshots with minimum store resolution', () => {
    const dir = path.dirname(fileURLToPath(import.meta.url));
    const manifestPath = path.join(dir, '..', '..', '..', 'docs', 'store_assets_manifest.json');
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as { screenshots: string[] };
    for (const rel of manifest.screenshots) {
      const bytes = readFileSync(path.join(dir, '..', '..', '..', rel));
      const { width, height } = pngDimensions(bytes);
      expect(width).toBeGreaterThanOrEqual(1080);
      expect(height).toBeGreaterThanOrEqual(1920);
    }
  });
});
