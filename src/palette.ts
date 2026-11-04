import { COLOR_SCHEMES } from './colors';
import type { ColorSchemeName } from './colors';

/** 2–5 hex colors. Extra colors beyond 5 are ignored. */
export type OrbColors = readonly [string, string, ...string[]];

export const MIN_COLORS = 2;
export const MAX_COLORS = 5;
export const DEFAULT_COLORS: OrbColors = ['#339999', '#194c4c', '#7df7ff'];

export type RGB = [number, number, number];
/** OKLCH: perceptual lightness (0–1), chroma, hue in radians. */
export type LCH = [number, number, number];

/** Parses `#rgb` or `#rrggbb` (the `#` is optional) into 0–1 sRGB. */
export function hexToRgb(hex: string): RGB {
  let h = hex.trim().replace(/^#/, '');
  if (h.length === 3) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (!/^[0-9a-fA-F]{6}$/.test(h)) {
    throw new Error(`react-native-magic-orb: invalid hex color "${hex}"`);
  }
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as RGB;
}

export function rgbToHex([r, g, b]: RGB): string {
  const to = (v: number) =>
    Math.round(Math.min(Math.max(v, 0), 1) * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${to(r)}${to(g)}${to(b)}`;
}

// sRGB <-> OKLab, from Björn Ottosson's reference implementation.
// Marked as worklets so hue shifting can run on the UI thread every frame.

function toLinear(c: number) {
  'worklet';
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function toGamma(c: number) {
  'worklet';
  return c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

export function rgbToLch(rgb: RGB): LCH {
  'worklet';
  const r = toLinear(rgb[0]);
  const g = toLinear(rgb[1]);
  const b = toLinear(rgb[2]);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return [L, Math.sqrt(A * A + B * B), Math.atan2(B, A)];
}

/** Converts OKLCH to sRGB. Out-of-gamut channels are clamped when `clamp` is true. */
export function lchToRgb(lch: LCH, clamp = true): RGB {
  'worklet';
  const A = lch[1] * Math.cos(lch[2]);
  const B = lch[1] * Math.sin(lch[2]);
  const l = Math.pow(lch[0] + 0.3963377774 * A + 0.2158037573 * B, 3);
  const m = Math.pow(lch[0] - 0.1055613458 * A - 0.0638541728 * B, 3);
  const s = Math.pow(lch[0] - 0.0894841775 * A - 1.291485548 * B, 3);
  const rgb: RGB = [
    toGamma(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    toGamma(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    toGamma(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
  if (!clamp) return rgb;
  return [
    Math.min(Math.max(rgb[0], 0), 1),
    Math.min(Math.max(rgb[1], 0), 1),
    Math.min(Math.max(rgb[2], 0), 1),
  ];
}

function inGamut(rgb: RGB) {
  return rgb.every((c) => c >= -0.0005 && c <= 1.0005);
}

/** Lowers chroma until the color fits in sRGB, keeping its lightness and hue. */
function fitToGamut(lch: LCH): RGB {
  let [L, C, h] = lch;
  for (let i = 0; i < 24 && !inGamut(lchToRgb([L, C, h], false)); i++) {
    C *= 0.9;
  }
  return lchToRgb([L, C, h]);
}

/**
 * Builds a harmonious palette from one color: neighbouring hues (analogous
 * harmony) spread around the base, with a gentle lightness ramp so the orb
 * keeps depth. Works in OKLCH so steps look even to the eye.
 *
 * @param base hex color, e.g. `'#7c3aed'`
 * @param count number of colors, 2–5 (default 3)
 */
export function generatePalette(base: string, count = 3): string[] {
  const n = Math.min(Math.max(Math.round(count), MIN_COLORS), MAX_COLORS);
  const [L, C, h] = rgbToLch(hexToRgb(base));
  // Near-grey inputs have no meaningful hue; give them a little color to spread.
  const chroma = Math.max(C, 0.04);
  const spread = (70 * Math.PI) / 180;
  const palette: string[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1) - 0.5; // -0.5 .. 0.5
    const lightness = Math.min(Math.max(L - t * 0.24, 0.12), 0.95);
    palette.push(rgbToHex(fitToGamut([lightness, chroma, h + t * spread])));
  }
  // Keep the base color itself in the palette (middle slot for odd counts).
  palette[Math.floor((n - 1) / 2)] = rgbToHex(hexToRgb(base));
  return palette;
}

interface ColorSources {
  colorScheme?: ColorSchemeName;
  colors?: readonly string[];
  color?: string;
}

/**
 * Picks the active palette: `colorScheme`, then `colors`, then `color`
 * (auto-generated), then the default. Always returns 2–5 colors.
 */
export function resolveColors({
  colorScheme,
  colors,
  color,
}: ColorSources): string[] {
  let list: readonly string[];
  if (colorScheme) list = COLOR_SCHEMES[colorScheme];
  else if (colors && colors.length > 0) list = colors;
  else if (color) list = generatePalette(color);
  else list = DEFAULT_COLORS;

  if (list.length < MIN_COLORS || list.length > MAX_COLORS) {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.warn(
        `react-native-magic-orb: "colors" takes ${MIN_COLORS}–${MAX_COLORS} colors, got ${list.length}.`
      );
    }
  }
  if (list.length === 1) return [list[0]!, list[0]!];
  return list.slice(0, MAX_COLORS);
}
