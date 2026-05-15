/** §7.2 世界階敘事 + 記憶冊靜態說明 — 與 UI 共用，供 vitest 迴歸 §八禁字（checklist 2.10.2） */

export function worldTierStory(tier: number): string {
  const stories: Record<number, string> = {
    1: '小屋的微光，牽著你的手慢慢暗下來。',
    2: '窗邊的植物歪著頭長了一片新葉。',
    3: '夜空裡劃過一行淡淡的流星碎光。',
    4: '遠方的山線亮了起來，像有人在等天亮。',
  };
  return stories[tier] ?? stories[1];
}

export function worldGrowthNarrative(progressFraction: number): string {
  const pct = Math.min(100, Math.max(0, Math.round(progressFraction * 100)));
  if (pct >= 80) return '本階離下一個風景只差一點距離。';
  if (pct >= 40) return '世界正慢慢亮起新的輪廓。';
  return '小屋還在慢慢長出新的一角。';
}

export const MEMORY_FOOTNOTE =
  '沒有編號、沒有稀有度框——只有今晚想記住的一句話。';

/** 禁止卡牌／圖鑑式用語出現在繪本向文案（§八） */
export const BANNED_IP_LEXICON = /SSR|UR\b|NO\.\s*\d+|圖鑑|夢獸收集|抽卡必中/i;

export function assertNoBannedIpLexicon(s: string): void {
  if (BANNED_IP_LEXICON.test(s)) {
    throw new Error(`copy_hit_banned_lexicon: ${s.slice(0, 40)}`);
  }
}
