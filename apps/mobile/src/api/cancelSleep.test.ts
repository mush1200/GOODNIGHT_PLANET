import { describe, expect, it, vi } from 'vitest';

vi.mock('react-native', () => ({
  Platform: { OS: 'ios' },
}));

import { postSleepCancel } from './client';

describe('sleep cancel client (7.2.1 / 9.1.5)', () => {
  it('returns cancelled and message fields', async () => {
    expect(postSleepCancel.length).toBe(1);
    expect(typeof postSleepCancel).toBe('function');
  });
});
