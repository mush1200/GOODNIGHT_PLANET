import { describe, expect, it, vi } from 'vitest';

vi.mock('react-native', () => ({
  Platform: { OS: 'ios' },
}));

import { fetchTemplateGoodnight } from './client';

describe('template goodnight UI hook (9.2.5)', () => {
  it('exposes GET /v1/push/template-goodnight helper', () => {
    expect(typeof fetchTemplateGoodnight).toBe('function');
  });
});
