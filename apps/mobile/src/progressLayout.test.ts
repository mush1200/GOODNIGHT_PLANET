import { describe, expect, it } from 'vitest';
import { clampWorldTierForUi, worldProgressPercent } from './progressLayout';

describe('progressLayout (2.10 UI math)', () => {
  it('clamps world tier to 1..3 for the visible strip', () => {
    expect(clampWorldTierForUi(0)).toBe(1);
    expect(clampWorldTierForUi(1)).toBe(1);
    expect(clampWorldTierForUi(2)).toBe(2);
    expect(clampWorldTierForUi(4)).toBe(3);
    expect(clampWorldTierForUi(5)).toBe(3);
    expect(clampWorldTierForUi(NaN)).toBe(1);
  });

  it('clamps world progress fraction to a sane percent', () => {
    expect(worldProgressPercent(0)).toBe(0);
    expect(worldProgressPercent(0.5)).toBe(50);
    expect(worldProgressPercent(1)).toBe(100);
    expect(worldProgressPercent(-0.2)).toBe(0);
    expect(worldProgressPercent(1.4)).toBe(100);
    expect(worldProgressPercent(NaN)).toBe(0);
  });
});
