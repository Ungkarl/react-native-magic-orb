import { describe, expect, it, jest } from '@jest/globals';
import {
  generatePalette,
  hexToRgb,
  lchToRgb,
  resolveColors,
  rgbToHex,
  rgbToLch,
} from '../palette';
import { COLOR_SCHEMES } from '../colors';

describe('hexToRgb / rgbToHex', () => {
  it('parses 6- and 3-digit hex, with or without #', () => {
    expect(hexToRgb('#ff0000')).toEqual([1, 0, 0]);
    expect(hexToRgb('0f0')).toEqual([0, 1, 0]);
    expect(rgbToHex(hexToRgb('#7C3AED'))).toBe('#7c3aed');
  });

  it('throws a clear error on invalid input', () => {
    expect(() => hexToRgb('blue')).toThrow(/invalid hex color "blue"/);
  });
});

describe('OKLCH conversion', () => {
  it('round-trips sRGB colors', () => {
    for (const hex of ['#339999', '#ff00c8', '#000428', '#fcf6ba', '#808080']) {
      expect(rgbToHex(lchToRgb(rgbToLch(hexToRgb(hex))))).toBe(hex);
    }
  });

  it('keeps lightness when rotating hue', () => {
    const [L, C, h] = rgbToLch(hexToRgb('#339999'));
    const rotated = rgbToLch(lchToRgb([L, C, h + Math.PI / 2]));
    expect(rotated[0]).toBeCloseTo(L, 1);
  });
});

describe('generatePalette', () => {
  const isHex = (c: string) => /^#[0-9a-f]{6}$/.test(c);

  it('returns `count` valid colors, clamped to 2–5', () => {
    expect(generatePalette('#7c3aed')).toHaveLength(3);
    expect(generatePalette('#7c3aed', 5)).toHaveLength(5);
    expect(generatePalette('#7c3aed', 1)).toHaveLength(2);
    expect(generatePalette('#7c3aed', 9)).toHaveLength(5);
    expect(generatePalette('#7c3aed', 4).every(isHex)).toBe(true);
  });

  it('keeps the base color in the palette', () => {
    expect(generatePalette('#7c3aed', 3)).toContain('#7c3aed');
    expect(generatePalette('#7c3aed', 4)).toContain('#7c3aed');
  });

  it('produces distinct colors, even from grey', () => {
    for (const base of ['#7c3aed', '#808080', '#000000']) {
      const p = generatePalette(base, 5);
      expect(new Set(p).size).toBe(5);
    }
  });
});

describe('resolveColors', () => {
  it('uses colorScheme, then colors, then color, then the default', () => {
    const colors = ['#111111', '#222222'] as const;
    expect(
      resolveColors({ colorScheme: 'fire', colors, color: '#7c3aed' })
    ).toEqual(COLOR_SCHEMES.fire);
    expect(resolveColors({ colors, color: '#7c3aed' })).toEqual(colors);
    expect(resolveColors({ color: '#7c3aed' })).toEqual(
      generatePalette('#7c3aed')
    );
    expect(resolveColors({})).toEqual(COLOR_SCHEMES.default);
  });

  it('caps at 5 colors and warns outside 2–5', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const six = [
      '#000001',
      '#000002',
      '#000003',
      '#000004',
      '#000005',
      '#000006',
    ];
    expect(resolveColors({ colors: six })).toHaveLength(5);
    expect(resolveColors({ colors: ['#123456'] })).toEqual([
      '#123456',
      '#123456',
    ]);
    expect(warn).toHaveBeenCalledTimes(2);
    warn.mockRestore();
  });
});
