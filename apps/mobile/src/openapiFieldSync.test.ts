import { describe, expect, it } from 'vitest';
import { OPENAPI_TODAY_REQUIRED_KEYS } from './api/openapiTypes';

describe('openapi field sync (8.3.3)', () => {
  it('keeps screen-facing today keys in contract list', () => {
    for (const key of [
      'forecastSummary',
      'rarityNarrativeTag',
      'attunementHint',
      'stardustBalance',
      'dayClosureCompleted',
    ] as const) {
      expect(OPENAPI_TODAY_REQUIRED_KEYS).toContain(key);
    }
  });
});
