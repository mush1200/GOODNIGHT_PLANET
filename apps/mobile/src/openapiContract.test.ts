import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { OPENAPI_TODAY_REQUIRED_KEYS } from './api/openapiTypes';

function readOpenApiRequiredKeys(): string[] {
  const dir = path.dirname(fileURLToPath(import.meta.url));
  const yaml = readFileSync(path.join(dir, '..', '..', '..', 'contracts', 'openapi.yaml'), 'utf8');
  const block = yaml.match(/TodayResponse:[\s\S]*?required:\n((?:\s+- .+\n)+)/);
  if (!block) throw new Error('TodayResponse.required missing');
  return [...block[1].matchAll(/- ([A-Za-z0-9_]+)/g)].map((m) => m[1]);
}

describe('openapi contract drift (7.3.3 / 9.4.1)', () => {
  it('keeps TodayResponse required keys aligned with openapi.yaml', () => {
    const yamlKeys = readOpenApiRequiredKeys();
    expect(yamlKeys).toEqual([...OPENAPI_TODAY_REQUIRED_KEYS]);
    expect(yamlKeys).toContain('attunementHint');
    expect(yamlKeys).toContain('homeDockHint');
  });

  it('anchors spec and balance table versions in openapi description', () => {
    const dir = path.dirname(fileURLToPath(import.meta.url));
    const yaml = readFileSync(path.join(dir, '..', '..', '..', 'contracts', 'openapi.yaml'), 'utf8');
    expect(yaml).toMatch(/GOODNIGHT_PLANET_MVP_SPEC v1\.5\.5/);
    expect(yaml).toMatch(/game_balance_tables\.md v0\.2/);
  });
});
