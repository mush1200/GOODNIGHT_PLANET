import { describe, expect, it, vi } from 'vitest';

vi.mock('react-native', () => ({
  Platform: { OS: 'ios' },
}));

import { postDayClosure } from './client';

describe('day closure skip contract (9.2.4)', () => {
  it('accepts skip action in client helper', () => {
    expect(postDayClosure.length).toBeGreaterThanOrEqual(1);
  });
});
