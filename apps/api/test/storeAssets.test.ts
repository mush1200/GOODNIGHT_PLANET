import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

describe('store assets manifest (7.4.3)', () => {
  it('lists five screenshots plus privacy and data disclosure', () => {
    const dir = path.dirname(fileURLToPath(import.meta.url));
    const manifestPath = path.join(dir, '..', '..', '..', 'docs', 'store_assets_manifest.json');
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as {
      screenshots: string[];
      privacy: string;
      data_disclosure: string;
    };
    expect(manifest.screenshots).toHaveLength(5);
    for (const rel of manifest.screenshots) {
      const bytes = readFileSync(path.join(dir, '..', '..', '..', rel));
      expect(bytes.subarray(0, 8).equals(PNG_SIGNATURE)).toBe(true);
      expect(bytes.length).toBeGreaterThan(8);
    }
    expect(readFileSync(path.join(dir, '..', '..', '..', manifest.privacy), 'utf8')).toMatch(/隱私/);
    expect(readFileSync(path.join(dir, '..', '..', '..', manifest.data_disclosure), 'utf8')).toMatch(/資料/);
  });
});