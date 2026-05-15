import { describe, expect, it } from 'vitest';
import { dreamVisualAccent, goodnightLineVisualVariant } from './contentVisual';

describe('content visual variants (8.5.1)', () => {
  it('derives stable variants for goodnight lines', () => {
    const line = '今晚把疲倦放下。';
    const a = goodnightLineVisualVariant(line);
    const b = goodnightLineVisualVariant(line);
    expect(a).toBeGreaterThanOrEqual(0);
    expect(a).toBeLessThan(3);
    expect(a).toBe(b);
  });

  it('keys dream and night sky accents', () => {
    expect(dreamVisualAccent('star_path', 'blue_moon')).toBe('star_path:blue_moon');
  });
});
