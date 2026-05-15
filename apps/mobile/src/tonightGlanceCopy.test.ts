import { describe, expect, it } from 'vitest';

import { ritualGlanceLine, tonightSkyGlanceLine } from './tonightGlanceCopy';
import { makeToday } from './test/todayFixture';

describe('tonightGlanceCopy', () => {
  it('formats the night sky as a single glance line', () => {
    expect(tonightSkyGlanceLine({ displayName: '細雨綿綿' })).toBe('今晚：細雨綿綿');
  });

  it('narrates ritual progress without dashboard numbers', () => {
    expect(ritualGlanceLine(makeToday({ ritualCountdownCompleted: false, sleepStarted: false }))).toBe(
      '儀式：還差一步，把燈慢慢關上',
    );
    expect(ritualGlanceLine(makeToday({ ritualCountdownCompleted: true, sleepStarted: false }))).toBe(
      '儀式：可以輕聲說晚安了',
    );
    expect(ritualGlanceLine(makeToday({ sleepStarted: true, sleeping: true }))).toBe(
      '儀式：正在夜裡慢慢歇著',
    );
  });
});
