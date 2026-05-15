/**
 * Short goodnight lines — §5.20 / tone_of_voice.md (not a long-text system).
 * Pool size is asserted in test/goodnightLines.test.ts (MVP checklist 1.6).
 */
export const GOODNIGHT_LINES: readonly string[] = [
  '今天辛苦了，我們慢慢來。',
  '小屋的燈還幫你留著。',
  '眼皮也快下班了。',
  '星光湖的反光變柔了。',
  '今晚先到這裡就好，剩下的明天再說。',
  '門沒上鎖，你隨時可以回來。',
  '風聲變小了，我們也走慢一點。',
  '被子先借你一半，不用急著道謝。',
  '月亮在練習變圓，你也練習放鬆。',
  '今天的事留在門外就好。',
  '窗邊的星子排隊等你抬頭。',
  '夜路不趕，我們並肩就好。',
  '把今天的重量交給枕頭。',
  '星光在窗邊排隊，不急著看完。',
  '小屋門縫漏進一線暖光。',
  '你回來了，這裡就亮一點。',
];

export function pickGoodnightLine(seed: string): string {
  const idx =
    seed.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % GOODNIGHT_LINES.length;
  return GOODNIGHT_LINES[idx]!;
}
