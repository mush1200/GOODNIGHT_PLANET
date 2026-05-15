import { describe, expect, it } from 'vitest';
import { GOODNIGHT_LINES } from '../src/goodnightLines.js';
import { NIGHT_SKY_DEFINITION_SSOT } from '../src/balance.js';

describe('content deepening thresholds (7.5.1)', () => {
  it('keeps slice skies at three while expanding goodnight lines', () => {
    expect(NIGHT_SKY_DEFINITION_SSOT).toHaveLength(3);
    expect(GOODNIGHT_LINES.length).toBeGreaterThanOrEqual(15);
  });
});
