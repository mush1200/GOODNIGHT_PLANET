import { describe, expect, it } from 'vitest';

const FIGMA_PHASE_TEST_IDS = [
  'TonightHome',
  'RitualCountdown',
  'Sleeping',
  'UnboxReveal',
  'MemorySnippet',
  'WorldProgress',
] as const;

describe('figma phase anchors (7.1.5)', () => {
  it('keeps six-screen testIDs aligned with 04_FIGMA_SCOPE.md', () => {
    expect(FIGMA_PHASE_TEST_IDS).toEqual([
      'TonightHome',
      'RitualCountdown',
      'Sleeping',
      'UnboxReveal',
      'MemorySnippet',
      'WorldProgress',
    ]);
  });
});
