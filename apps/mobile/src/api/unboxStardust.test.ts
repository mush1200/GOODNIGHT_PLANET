import { describe, expect, it } from 'vitest';
import { stardustNarrative } from '../stardustNarrative';

describe('unbox stardust feedback (9.2.3)', () => {
  it('narrates unbox balance without raw ledger keys', () => {
    expect(stardustNarrative(6)).toMatch(/6/);
    expect(stardustNarrative(6)).not.toMatch(/stardustBalance/);
  });
});
