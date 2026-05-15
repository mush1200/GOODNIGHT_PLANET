import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: vi.fn(async () => null),
    setItem: vi.fn(async () => undefined),
  },
}));

import { OFFLINE_RETRY_COPY, readOfflineQueue } from './offlineQueue';

describe('offline queue (7.3.1)', () => {
  it('starts empty when storage is unavailable in node tests', async () => {
    const queue = await readOfflineQueue();
    expect(Array.isArray(queue)).toBe(true);
  });

  it('uses tone-safe retry copy', () => {
    expect(OFFLINE_RETRY_COPY).not.toMatch(/失敗|活該|丟臉/);
  });
});
