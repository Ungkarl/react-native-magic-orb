/**
 * @jest-environment node
 */
/// <reference types="node" />
// Compiles and renders every orb shader with CanvasKit (Skia compiled to WebAssembly),
// the same engine react-native-skia uses on device. On a device, a shader that fails to
// compile renders nothing and throws no error, so this is the check that catches it.
import path from 'path';
import { beforeAll, describe, expect, it } from '@jest/globals';
import type { CanvasKit } from 'canvaskit-wasm';
import { orbSksl } from '../shaders/orb.sksl';
import { classicSksl } from '../shaders/classic.sksl';

const canvasKitDir = path.dirname(
  require.resolve('canvaskit-wasm/bin/full/canvaskit.js')
);

const CanvasKitInit = require('canvaskit-wasm/bin/full/canvaskit.js');

// Every uniform the library supplies at runtime (see useOrbAnimation). A shader that
// declares anything else would throw on device.
const SIZE = 160;
interface RenderOptions {
  glowIntensity?: number;
  colorCount?: number;
  intensity?: number;
  noiseScale?: number;
  innerRadius?: number;
}
const suppliedUniforms = (
  iTime: number,
  {
    glowIntensity = 0.7,
    colorCount = 3,
    intensity = 0.4,
    noiseScale = 0.85,
    innerRadius = 0.6,
  }: RenderOptions = {}
) => ({
  iTime: [iTime],
  iResolution: [SIZE, SIZE],
  color1: [0, 0.96, 1],
  color2: [0.62, 0, 1],
  color3: [1, 0, 0.78],
  // Pure green and yellow: easy to detect, and absent from colors 1–3.
  color4: [0, 1, 0],
  color5: [1, 1, 0],
  colorCount: [colorCount],
  noiseScale: [noiseScale],
  innerRadius: [innerRadius],
  intensity: [intensity],
  noiseSpeed: [0.5],
  glowIntensity: [glowIntensity],
});

let CK: CanvasKit;

beforeAll(async () => {
  CK = await CanvasKitInit({
    locateFile: (file: string) => path.join(canvasKitDir, file),
  });
});

function compile(source: string) {
  const errors: string[] = [];
  const effect = CK.RuntimeEffect.Make(source, (e) => errors.push(e));
  return { effect, errors };
}

/** Renders one frame and returns helpers over its RGBA pixels (0–255). */
function render(source: string, iTime: number, options?: RenderOptions) {
  const { effect } = compile(source);
  if (!effect) throw new Error('shader failed to compile');
  const values = suppliedUniforms(iTime, options) as Record<string, number[]>;
  const uniforms: number[] = [];
  for (let i = 0; i < effect.getUniformCount(); i++) {
    uniforms.push(...values[effect.getUniformName(i)]!);
  }
  const surface = CK.MakeSurface(SIZE, SIZE)!;
  const paint = new CK.Paint();
  paint.setShader(effect.makeShader(uniforms));
  surface.getCanvas().drawPaint(paint);
  const pixels = surface.makeImageSnapshot().readPixels(0, 0, {
    width: SIZE,
    height: SIZE,
    colorType: CK.ColorType.RGBA_8888,
    alphaType: CK.AlphaType.Unpremul,
    colorSpace: CK.ColorSpace.SRGB,
  }) as Uint8Array;
  surface.delete();
  const alpha = (x: number, y: number) => pixels[(y * SIZE + x) * 4 + 3]!;
  let total = 0;
  for (let i = 3; i < pixels.length; i += 4) total += pixels[i]!;
  /** Counts bright pixels whose color is close to `rgb` (0–255 channels). */
  const countNear = (rgb: [number, number, number], tolerance = 60) => {
    let count = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3]! < 120) continue;
      const d =
        Math.abs(pixels[i]! - rgb[0]) +
        Math.abs(pixels[i + 1]! - rgb[1]) +
        Math.abs(pixels[i + 2]! - rgb[2]);
      if (d < tolerance) count++;
    }
    return count;
  };
  /** Counts bright pixels whose green channel beats red and blue combined. */
  const countGreenDominant = () => {
    let count = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3]! < 120) continue;
      if (pixels[i + 1]! > pixels[i]! + pixels[i + 2]!) count++;
    }
    return count;
  };
  /**
   * Walks 72 rays from the center to the edge and returns the highest number of
   * separate bright bands any ray crosses. An intact ring gives 1 on every ray.
   */
  const maxBandsPerRay = (high = 110, low = 60) => {
    let worst = 0;
    const c = SIZE / 2;
    for (let a = 0; a < 72; a++) {
      const angle = (a / 72) * Math.PI * 2;
      let bands = 0;
      let inside = false;
      for (let r = 0; r < c - 1; r++) {
        const x = Math.round(c + Math.cos(angle) * r);
        const y = Math.round(c + Math.sin(angle) * r);
        const value = alpha(x, y);
        // Two thresholds, so pixel rounding at the ring's edge can't count as a new band.
        if (!inside && value > high) {
          bands++;
          inside = true;
        } else if (inside && value < low) {
          inside = false;
        }
      }
      worst = Math.max(worst, bands);
    }
    return worst;
  };
  return { alpha, total, countNear, countGreenDominant, maxBandsPerRay };
}

describe.each([
  ['Orb', orbSksl],
  ['ClassicOrb', classicSksl],
])('%s shader', (_name, source) => {
  it('compiles with Skia', () => {
    const { effect, errors } = compile(source);
    expect(errors).toEqual([]);
    expect(effect).not.toBeNull();
  });

  it('only declares uniforms the library supplies', () => {
    const { effect } = compile(source);
    const supplied = Object.keys(suppliedUniforms(0));
    for (let i = 0; i < effect!.getUniformCount(); i++) {
      expect(supplied).toContain(effect!.getUniformName(i));
    }
  });

  // Early and very late times: precision problems tend to show up after long runs.
  it.each([5, 3000])(
    'renders a visible ring with a hollow center at t=%ss',
    (t) => {
      const { alpha, total } = render(source, t);
      const c = SIZE / 2;
      expect(total).toBeGreaterThan(SIZE * SIZE * 10);
      expect(alpha(c, c)).toBeLessThan(10);
      expect(alpha(0, 0)).toBeLessThan(10);
    }
  );
});

it('Orb glow adds light when glowIntensity is raised', () => {
  const off = render(orbSksl, 5, { glowIntensity: 0 }).total;
  const on = render(orbSksl, 5, { glowIntensity: 1 }).total;
  expect(on).toBeGreaterThan(off * 1.1);
});

describe('Orb colorCount', () => {
  it.each([2, 3, 4, 5])('renders a visible ring with %i colors', (n) => {
    const { total } = render(orbSksl, 5, { colorCount: n });
    expect(total).toBeGreaterThan(SIZE * SIZE * 10);
  });

  it('only shows colors 4 and 5 when colorCount includes them', () => {
    // Color 4 is pure green. Colors blend widely, so look for green-dominant pixels
    // (green brighter than red and blue together), which colors 1–3 never produce.
    // Sample a few moments so moving colors cannot hide one by chance.
    const green = (n: number) =>
      [5, 40, 90].reduce(
        (sum, t) =>
          sum + render(orbSksl, t, { colorCount: n }).countGreenDominant(),
        0
      );
    expect(green(3)).toBe(0);
    expect(green(5)).toBeGreaterThan(0);
  });
});

describe('Orb shape at extreme props', () => {
  const extremes: [string, RenderOptions][] = [
    ['high intensity', { intensity: 1.5 }],
    ['high noiseScale', { noiseScale: 3, intensity: 1 }],
    ['small innerRadius', { innerRadius: 0.1, noiseScale: 2, intensity: 0.8 }],
    ['large innerRadius', { innerRadius: 0.95, intensity: 1 }],
  ];

  it.each(extremes)('stays one intact ring with %s', (_label, options) => {
    for (const t of [3, 7, 40]) {
      const { maxBandsPerRay, alpha } = render(orbSksl, t, options);
      expect(maxBandsPerRay()).toBe(1);
      // The ring and its glow stay inside the canvas instead of being cut off.
      expect(alpha(0, 0)).toBeLessThan(10);
      expect(alpha(SIZE / 2, 0)).toBeLessThan(60);
    }
  });
});
