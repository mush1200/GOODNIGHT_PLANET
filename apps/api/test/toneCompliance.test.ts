import { describe, expect, it } from 'vitest';
import { rarityNarrativeTag } from '../src/balance.js';
import { GOODNIGHT_LINES } from '../src/goodnightLines.js';
import { allTemplateGoodnightBodies } from '../src/templateGoodnight.js';
import { CANCEL_SLEEP_MESSAGES, MOON_GUARD_MESSAGES } from '../src/userFacingStrings.js';
import { worldAttunementState } from '../src/worldAttunement.js';

const shame = /失敗|活該|丟臉|你又不|沒救了|你應該|再不睡|治療失眠|睡眠障礙/i;
const gacha = /SSR|UR\b|NO\.\s*\d+|圖鑑/i;

function allSurfaceStrings(): string[] {
  const hints: string[] = [];
  const now = new Date('2026-05-13T12:00:00.000Z');
  const last = new Date('2026-05-09T12:00:00.000Z');
  for (const rc of [false, true]) {
    for (const ss of [false, true]) {
      const h = worldAttunementState({
        lastOpenAt: last,
        now,
        ritualCountdownCompleted: rc,
        sleepStarted: ss,
      }).attunementHint;
      if (h) hints.push(h);
    }
  }
  return [
    ...GOODNIGHT_LINES,
    ...allTemplateGoodnightBodies(),
    ...Object.values(CANCEL_SLEEP_MESSAGES),
    ...Object.values(MOON_GUARD_MESSAGES),
    rarityNarrativeTag('common'),
    rarityNarrativeTag('uncommon'),
    rarityNarrativeTag('rare'),
    ...hints,
  ];
}

describe('tone & IP surface strings (4.4)', () => {
  it('catalogued user-facing copy avoids shame / medical / harsh commands', () => {
    for (const s of allSurfaceStrings()) {
      expect(String(s)).not.toMatch(shame);
    }
  });

  it('rarity narrative tags avoid gacha lexicon', () => {
    for (const r of ['common', 'uncommon', 'rare']) {
      expect(rarityNarrativeTag(r)).not.toMatch(gacha);
    }
  });
});
