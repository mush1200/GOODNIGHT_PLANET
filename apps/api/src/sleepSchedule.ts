const timeRe = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function isValidLocalHm(s: string): boolean {
  return timeRe.test(s);
}

/** 目標睡眠分鐘數：就寢至起床；跨日則 wake 視為隔日（§5.1） */
export function targetSleepDurationMinutes(bed: string, wake: string): number | null {
  if (!isValidLocalHm(bed) || !isValidLocalHm(wake)) return null;
  const [bh, bm] = bed.split(':').map(Number) as [number, number];
  const [wh, wm] = wake.split(':').map(Number) as [number, number];
  let bt = bh * 60 + bm;
  let wt = wh * 60 + wm;
  if (wt <= bt) wt += 24 * 60;
  return wt - bt;
}
