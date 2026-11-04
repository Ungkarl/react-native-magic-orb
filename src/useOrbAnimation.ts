import { useEffect, useMemo } from 'react';
import {
  useSharedValue,
  useFrameCallback,
  useDerivedValue,
} from 'react-native-reanimated';
import type { FrameInfo } from 'react-native-reanimated';
import type { Uniforms } from '@shopify/react-native-skia';
import { MAX_COLORS, hexToRgb, lchToRgb, rgbToLch } from './palette';
import type { LCH, RGB } from './palette';

interface OrbAnimationOptions {
  size: number;
  speed: number;
  wobbleSpeed: number;
  intensity: number;
  noiseScale: number;
  innerRadius: number;
  glowIntensity: number;
  /** 2–5 resolved hex colors. */
  colors: string[];
  /** Hue rotation in degrees per second (0 = off). */
  hueShift: number;
  /** When false, the frame loop stops: no per-frame work and no redraws. */
  running: boolean;
}

export function useOrbAnimation({
  size,
  speed,
  wobbleSpeed,
  intensity,
  noiseScale,
  innerRadius,
  glowIntensity,
  colors,
  hueShift,
  running,
}: OrbAnimationOptions) {
  const time = useSharedValue(0);

  const frameCallback = useFrameCallback((frameInfo: FrameInfo) => {
    if (frameInfo.timeSincePreviousFrame !== null) {
      // Cap the step so resuming after a pause never makes the animation jump.
      const dt = Math.min(frameInfo.timeSincePreviousFrame, 100);
      time.value += dt * 0.001 * speed;
    }
  }, running);

  // Start/stop Reanimated's frame loop (an external system) to match `running`.
  useEffect(() => {
    frameCallback.setActive(running);
  }, [frameCallback, running]);

  // Parse once per palette (inline arrays are new every render, so key by content).
  const colorsKey = colors.join(',');
  const palette = useMemo(() => {
    const rgb = colorsKey.split(',').map(hexToRgb);
    // Every shader declares 5 color slots; unused slots repeat the last color.
    while (rgb.length < MAX_COLORS) rgb.push(rgb[rgb.length - 1]!);
    return {
      count: colorsKey.split(',').length,
      rgb,
      lch: rgb.map(rgbToLch),
    };
  }, [colorsKey]);

  const hueShiftRad = (hueShift * Math.PI) / 180;

  const uniforms = useDerivedValue<Uniforms>(() => {
    let rgb: RGB[] = palette.rgb;
    if (hueShiftRad !== 0) {
      // Rotate every color around the OKLCH hue wheel, keeping lightness and chroma.
      const shift = hueShiftRad * time.value;
      rgb = palette.lch.map(
        (c: LCH): RGB => lchToRgb([c[0], c[1], c[2] + shift])
      );
    }
    return {
      iTime: time.value,
      iResolution: [size, size],
      color1: rgb[0]!,
      color2: rgb[1]!,
      color3: rgb[2]!,
      color4: rgb[3]!,
      color5: rgb[4]!,
      colorCount: palette.count,
      noiseScale,
      innerRadius,
      intensity,
      noiseSpeed: wobbleSpeed,
      glowIntensity,
    };
  });

  return uniforms;
}
