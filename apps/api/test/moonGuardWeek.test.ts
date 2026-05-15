import { describe, expect, it } from 'vitest';
import { moonGuardIsoWeek } from '../src/moonGuardWeek.js';

describe('moonGuardIsoWeek (2.8.1)', () => {
  it('formats ISO week id', () => {
    const k = moonGuardIsoWeek(new Date('2026-05-13T12:00:00.000Z'));
    expect(k).toMatch(/^\d{4}-W\d{2}$/);
  });
});
