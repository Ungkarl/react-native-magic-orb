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
const suppliedUniforms = (iTime: number, glowIntensity = 0.7) => ({
  iTime: [iTime],
  iResolution: [SIZE, SIZE],
  color1: [0, 0.96, 1],
  color2: [0.62, 0, 1],
  color3: [1, 0, 0.78],
  noiseScale: [0.85],
  innerRadius: [0.6],
  intensity: [0.4],
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

/** Renders one frame and returns its alpha channel (0–255). */
function renderAlpha(source: string, iTime: number, glowIntensity?: number) {
  const { effect } = compile(source);
  if (!effect) throw new Error('shader failed to compile');
  const values = suppliedUniforms(iTime, glowIntensity) as Record<
    string,
    number[]
  >;
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
  return { alpha, total };
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
      const { alpha, total } = renderAlpha(source, t);
      const c = SIZE / 2;
      expect(total).toBeGreaterThan(SIZE * SIZE * 10);
      expect(alpha(c, c)).toBeLessThan(10);
      expect(alpha(0, 0)).toBeLessThan(10);
    }
  );
});

it('Orb glow adds light when glowIntensity is raised', () => {
  const off = renderAlpha(orbSksl, 5, 0).total;
  const on = renderAlpha(orbSksl, 5, 1).total;
  expect(on).toBeGreaterThan(off * 1.1);
});
