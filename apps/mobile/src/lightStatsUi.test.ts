import { describe, expect, it } from 'vitest';
import { makeToday } from './test/todayFixture';
import { lightStatsLines } from './lightStatsUi';

describe('light stats UI (9.2.1)', () => {
  it('formats nights completed and recent logical dates', () => {
    const lines = lightStatsLines(
      makeToday({
        nightsCompleted: 4,
        daysSinceLastOpenLogical: 2,
        lastCompletedLogicalDate: '2026-05-11',
        lastSleepLogicalDate: '2026-05-12',
      }),
    );
    expect(lines).toEqual([
      '已完成 4 個邏輯夜',
      '距上次開啟已 2 個邏輯日',
      '最近結束：2026 年 5 月 11 日',
      '最近入睡：2026 年 5 月 12 日',
    ]);
  });
});
