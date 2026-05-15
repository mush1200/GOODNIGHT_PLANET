import { describe, expect, it } from 'vitest';

import {
  RITUAL_FINAL_QUIET_SECONDS,
  resolveEmotionalPacing,
  ritualHintCopy,
} from './emotionalPacing';

describe('emotionalPacing (§7.4)', () => {
  it('silences ritual hint in the final quiet window', () => {
    expect(ritualHintCopy(RITUAL_FINAL_QUIET_SECONDS)).toBe('');
    expect(ritualHintCopy(RITUAL_FINAL_QUIET_SECONDS - 1)).toBe('');
    expect(ritualHintCopy(RITUAL_FINAL_QUIET_SECONDS + 1)).toContain('慢慢呼吸');
  });

  it('disables ui click sound in ritual final window', () => {
    const cue = resolveEmotionalPacing({ phase: 'ritual', ritualSecondsLeft: 3 });
    expect(cue.allowUiClickSound).toBe(false);
    expect(cue.copyBudget).toBe('silent');
  });

  it('keeps home as one-line pacing with ambient bed', () => {
    const cue = resolveEmotionalPacing({ phase: 'home' });
    expect(cue.copyBudget).toBe('one_line');
    expect(cue.allowAmbientBed).toBe(true);
  });
});
