import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

describe('release CI workflow (7.4.1)', () => {
  it('runs api and mobile tests with DATABASE_URL for integration', () => {
    const dir = path.dirname(fileURLToPath(import.meta.url));
    const workflow = readFileSync(
      path.join(dir, '..', '..', '..', '.github', 'workflows', 'release.yml'),
      'utf8',
    );
    expect(workflow).toMatch(/apps\/api/);
    expect(workflow).toMatch(/apps\/mobile/);
    expect(workflow).toMatch(/DATABASE_URL/);
  });
});
