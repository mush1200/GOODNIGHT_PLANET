/** Pure layout helpers for 2.10 progress UI — safe to test in Node (no RN import). */

/** MVP 首屏與進度條最多展示到第 3 階；後端仍保留第 4 階資料。 */
export const MAX_WORLD_TIER_VISIBLE = 3;

export function clampWorldTierForUi(tier: number): number {
  const n = Number.isFinite(tier) ? tier : 1;
  return Math.min(MAX_WORLD_TIER_VISIBLE, Math.max(1, Math.round(n)));
}
export function worldProgressPercent(fraction: number): number {
  const f = Number.isFinite(fraction) ? fraction : 0;
  return Math.round(Math.min(1, Math.max(0, f)) * 100);
}
