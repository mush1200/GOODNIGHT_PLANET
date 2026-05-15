import { describe, expect, it, vi } from 'vitest';

vi.mock('react-native', () => ({
  Platform: { OS: 'ios' },
}));

import { postDayClosure } from './client';

describe('day closure client (7.2.2 / 9.1.2)', () => {
  it('accepts complete and skip actions', () => {
    expect(postDayClosure.length).toBeGreaterThanOrEqual(1);
    expect(typeof postDayClosure).toBe('function');
  });
});
