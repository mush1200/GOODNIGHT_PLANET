import { describe, expect, it } from 'vitest';
import { homeDockHint } from '../src/homeDockHint.js';

const shame = /失敗|活該|丟臉|你又不|沒救了|治療失眠|睡眠障礙/i;

describe('homeDockHint (2.8.3)', () => {
  it('prefers attunement hint when present', () => {
    const h = homeDockHint({
      worldAttunement: 'wilted',
      attunementHint: '我們等你好久了，小屋還在這裡。',
      daysSinceLastOpenLogical: 5,
    });
    expect(h).toBe('我們等你好久了，小屋還在這裡。');
    expect(h).not.toMatch(shame);
  });

  it('steady copy is non-guilt', () => {
    const h = homeDockHint({
      worldAttunement: 'steady',
      attunementHint: null,
      daysSinceLastOpenLogical: 0,
    });
    expect(h).toMatch(/小屋|柔光/);
    expect(String(h)).not.toMatch(shame);
  });
});
