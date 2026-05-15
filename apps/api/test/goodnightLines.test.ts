import { describe, expect, it } from 'vitest';
import { GOODNIGHT_LINES, pickGoodnightLine } from '../src/goodnightLines.js';

describe('goodnight line pool (MVP checklist 1.6)', () => {
  it('has at least 10 distinct lines', () => {
    expect(GOODNIGHT_LINES.length).toBeGreaterThanOrEqual(10);
    const unique = new Set(GOODNIGHT_LINES);
    expect(unique.size).toBe(GOODNIGHT_LINES.length);
  });

  it('pickGoodnightLine is deterministic for the same seed', () => {
    const seed = '2026-05-13user-abc';
    expect(pickGoodnightLine(seed)).toBe(pickGoodnightLine(seed));
  });

  it('pickGoodnightLine always returns a non-empty pool entry', () => {
    for (let i = 0; i < 50; i++) {
      const line = pickGoodnightLine(`seed-${i}`);
      expect(line.length).toBeGreaterThan(0);
      expect(GOODNIGHT_LINES).toContain(line);
    }
  });
});
