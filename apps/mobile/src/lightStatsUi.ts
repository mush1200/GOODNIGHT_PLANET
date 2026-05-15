import type { TodayResponse } from './api/client';
import { formatLogicalDateForDisplay } from './timezone';

export function lightStatsLines(today: TodayResponse): string[] {
  const lines: string[] = [];
  if (typeof today.nightsCompleted === 'number') {
    lines.push(`已完成 ${today.nightsCompleted} 個邏輯夜`);
  }
  if (typeof today.daysSinceLastOpenLogical === 'number' && today.daysSinceLastOpenLogical > 0) {
    lines.push(`距上次開啟已 ${today.daysSinceLastOpenLogical} 個邏輯日`);
  }
  if (today.lastCompletedLogicalDate) {
    lines.push(`最近結束：${formatLogicalDateForDisplay(today.lastCompletedLogicalDate)}`);
  }
  if (today.lastSleepLogicalDate) {
    lines.push(`最近入睡：${formatLogicalDateForDisplay(today.lastSleepLogicalDate)}`);
  }
  return lines;
}
