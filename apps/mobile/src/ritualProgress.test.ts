import { describe, expect, it } from 'vitest';
import { ritualProgressLines, ritualStepStates } from './ritualProgress';

describe('ritualProgress lines (2.10.1)', () => {
  it('reflects API flags for checklist §7.2', () => {
    const a = ritualProgressLines({ ritualCountdownCompleted: false, sleepStarted: false });
    expect(a.countdownLine).toContain('○');
    expect(a.sleepLine).toContain('○');
    const b = ritualProgressLines({ ritualCountdownCompleted: true, sleepStarted: true });
    expect(b.countdownLine).toContain('✓');
    expect(b.sleepLine).toContain('✓');
  });

  it('ritualStepStates stays in sync with progress lines', () => {
    const today = { ritualCountdownCompleted: true, sleepStarted: false };
    const steps = ritualStepStates(today);
    const lines = ritualProgressLines(today);
    expect(steps).toHaveLength(2);
    expect(steps[0]).toMatchObject({ id: 'countdown', done: true });
    expect(steps[1]).toMatchObject({ id: 'sleep', done: false });
    expect(lines.countdownLine.startsWith('✓')).toBe(true);
    expect(lines.sleepLine.startsWith('○')).toBe(true);
  });
});
