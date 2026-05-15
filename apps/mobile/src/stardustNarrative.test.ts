import { describe, expect, it } from 'vitest';
import { stardustNarrative } from './stardustNarrative';

describe('stardustNarrative (8.2.6)', () => {
  it('narrates balance without exposing raw ledger keys', () => {
    expect(stardustNarrative(0)).toMatch(/星塵/);
    expect(stardustNarrative(8)).toMatch(/8/);
    expect(stardustNarrative(undefined)).toBeNull();
  });
});
