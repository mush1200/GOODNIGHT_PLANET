import type { WorldAttunementKind } from './worldAttunement.js';

/**
 * 2.8.3 小屋／開屏輕提示 — 與可逆牽掛併用：`attunementHint` 優先，其餘補一句非 guilt 文案。
 */
export function homeDockHint(args: {
  worldAttunement: WorldAttunementKind;
  attunementHint: string | null;
  daysSinceLastOpenLogical: number;
}): string | null {
  if (args.attunementHint) return args.attunementHint;
  if (args.worldAttunement === 'recovering') return '你回來了，小屋的光也慢慢亮回來。';
  if (args.daysSinceLastOpenLogical >= 1 && args.daysSinceLastOpenLogical <= 3) {
    return '今天也走到這裡了，慢慢來沒關係。';
  }
  if (args.daysSinceLastOpenLogical > 3) return '門邊的燈還亮著，想休息時再靠過來就好。';
  return '今晚的小屋幫你留了一盞柔光。';
}
