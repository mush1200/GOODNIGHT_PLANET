import { describe, expect, it } from 'vitest';
import {
  BANNED_IP_LEXICON,
  MEMORY_FOOTNOTE,
  assertNoBannedIpLexicon,
  worldGrowthNarrative,
  worldTierStory,
} from './progressCopy';
describe('progressCopy (2.10.2)', () => {
  it('world tier lines avoid banned lexicon', () => {
    for (let t = 1; t <= 4; t++) {
      const s = worldTierStory(t);
      expect(s).not.toMatch(BANNED_IP_LEXICON);
      expect(() => assertNoBannedIpLexicon(s)).not.toThrow();
    }
  });

  it('memory footnote stays non-gacha', () => {
    expect(MEMORY_FOOTNOTE).toMatch(/記住/);
    expect(MEMORY_FOOTNOTE).not.toMatch(BANNED_IP_LEXICON);
  });

  it('world growth narrative avoids raw engineering keys (9.4.4)', () => {
    const line = worldGrowthNarrative(0.5);
    expect(line).not.toMatch(/worldGrowthValue/);
    expect(line).toMatch(/世界/);
  });
});
