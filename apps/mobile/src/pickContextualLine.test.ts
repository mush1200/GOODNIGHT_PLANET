import { describe, expect, it } from 'vitest';

import { pickContextualLine } from './pickContextualLine';
import { makeToday } from './test/todayFixture';

const idleRitual = {
  ritualCountdownCompleted: false,
  sleepStarted: false,
  sleeping: false,
  unboxed: false,
} as const;

describe('pickContextualLine', () => {
  it('prioritizes ritual state over missed_you', () => {
    const line = pickContextualLine(
      makeToday({
        sleeping: true,
        daysSinceLastOpenLogical: 3,
        worldAttunement: 'steady',
      }),
    );

    expect(line.priorityKey).toBe('ritual_state');
    expect(line.line).toMatch(/夜裡|開箱/);
  });

  it('prioritizes recovering over missed_you', () => {
    const line = pickContextualLine(
      makeToday({
        worldAttunement: 'recovering',
        daysSinceLastOpenLogical: 3,
        nightsCompleted: 0,
        ...idleRitual,
      }),
    );

    expect(line.priorityKey).toBe('recovering');
    expect(line.line).toMatch(/小屋的燈|燈還/);
  });

  it('prioritizes wilted over missed_you', () => {
    const line = pickContextualLine(
      makeToday({
        worldAttunement: 'wilted',
        daysSinceLastOpenLogical: 3,
        nightsCompleted: 2,
        ...idleRitual,
      }),
    );

    expect(line.priorityKey).toBe('wilted');
    expect(line.line).toMatch(/蔫|燈/);
  });

  it('prioritizes missed_you over first_night', () => {
    const line = pickContextualLine(
      makeToday({
        daysSinceLastOpenLogical: 2,
        nightsCompleted: 0,
        worldAttunement: 'steady',
        ...idleRitual,
      }),
    );

    expect(line.priorityKey).toBe('missed_you');
  });

  it('prioritizes first_night over early_bed', () => {
    const line = pickContextualLine(
      makeToday({
        nightsCompleted: 0,
        earlyBedForDream: true,
        worldAttunement: 'steady',
        daysSinceLastOpenLogical: 0,
        ...idleRitual,
      }),
    );

    expect(line.priorityKey).toBe('first_night');
  });

  it('prioritizes early_bed over steady_rhythm', () => {
    const line = pickContextualLine(
      makeToday({
        nightsCompleted: 2,
        earlyBedForDream: true,
        streakDays: 4,
        worldAttunement: 'steady',
        daysSinceLastOpenLogical: 0,
        ...idleRitual,
      }),
    );

    expect(line.priorityKey).toBe('early_bed');
  });

  it('falls back to the server goodnight line', () => {
    const line = pickContextualLine(
      makeToday({
        nightsCompleted: 2,
        streakDays: 1,
        earlyBedForDream: false,
        worldAttunement: 'steady',
        daysSinceLastOpenLogical: 0,
        goodnightLine: '今晚把疲倦放下。',
        ...idleRitual,
      }),
    );

    expect(line.priorityKey).toBe('fallback');
    expect(line.line).toBe('今晚把疲倦放下。');
  });

  it('uses homeDockHint before fallback goodnight line', () => {
    const line = pickContextualLine(
      makeToday({
        nightsCompleted: 2,
        streakDays: 1,
        homeDockHint: '小屋的燈還幫你留著。',
        goodnightLine: '今晚把疲倦放下。',
        ...idleRitual,
      }),
    );

    expect(line.priorityKey).toBe('home_dock');
    expect(line.line).toBe('小屋的燈還幫你留著。');
  });

  it('uses shy copy for first_night when the pet archetype is shy', () => {
    const line = pickContextualLine(
      makeToday({
        nightsCompleted: 0,
        petArchetype: 'shy',
        worldAttunement: 'steady',
        daysSinceLastOpenLogical: 0,
        ...idleRitual,
      }),
    );

    expect(line.priorityKey).toBe('first_night');
    expect(line.line).toBe('第一次的夜……這裡有我，還有留著的燈。');
    expect(line.tone).toBe('quiet');
  });

  it('uses night_owl copy for steady_rhythm when the pet archetype is night_owl', () => {
    const line = pickContextualLine(
      makeToday({
        nightsCompleted: 4,
        streakDays: 4,
        petArchetype: 'night_owl',
        worldAttunement: 'steady',
        daysSinceLastOpenLogical: 0,
        ...idleRitual,
      }),
    );

    expect(line.priorityKey).toBe('steady_rhythm');
    expect(line.line).toBe('幾晚都回來了；這屋子總算記得你腳步了吧。');
    expect(line.tone).toBe('warm');
  });
});
