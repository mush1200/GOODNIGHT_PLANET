/** Client policy for logical sleep date display — aligns with API Asia/Taipei default. */

export const CLIENT_TIMEZONE = 'Asia/Taipei';

export function formatLogicalDateForDisplay(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  if (!y || !m || !d) return isoDate;
  return `${y} 年 ${m} 月 ${d} 日`;
}

export function localDateKeyInTimezone(date: Date, timeZone = CLIENT_TIMEZONE): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const y = parts.find((p) => p.type === 'year')?.value;
  const m = parts.find((p) => p.type === 'month')?.value;
  const d = parts.find((p) => p.type === 'day')?.value;
  return `${y}-${m}-${d}`;
}

export function localHourInTimezone(date: Date, timeZone = CLIENT_TIMEZONE): number {
  const hour = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: 'numeric',
    hourCycle: 'h23',
  }).format(date);
  return Number(hour);
}
