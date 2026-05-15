import { describe, expect, it } from 'vitest';
import { attunementVisual } from './attunementTheme';

describe('world attunement visuals (7.1.4)', () => {
  it('dims wilted and warms recovering', () => {
    expect(attunementVisual('wilted').saturation).toBeLessThan(attunementVisual('steady').saturation);
    expect(attunementVisual('recovering').accent).not.toBe(attunementVisual('steady').accent);
  });
});
