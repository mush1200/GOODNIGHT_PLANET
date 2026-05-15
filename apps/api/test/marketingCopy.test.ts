import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const bad = /治療失眠|睡眠障礙|失眠治療|夢獸|抽卡必中|SSR|UR\b|必勝/i;

describe('store_copy.md marketing strings (4.2)', () => {
  it('avoids medical / gacha positioning', () => {
    const dir = path.dirname(fileURLToPath(import.meta.url));
    const p = path.join(dir, '..', '..', '..', 'docs', 'store_copy.md');
    const md = readFileSync(p, 'utf8');
    expect(md.length).toBeGreaterThan(20);
    expect(md).not.toMatch(bad);
  });
});
