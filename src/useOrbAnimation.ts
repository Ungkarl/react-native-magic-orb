import {
  useSharedValue,
  useFrameCallback,
  useDerivedValue,
} from 'react-native-reanimated';
import type { FrameInfo } from 'react-native-reanimated';
import type { Uniforms } from '@shopify/react-native-skia';

interface OrbAnimationOptions {
  size: number;
  speed: number;
  wobbleSpeed: number;
  intensity: number;
  noiseScale: number;
  innerRadius: number;
  parsedColors: {
    c1: [number, number, number];
    c2: [number, number, number];
    c3: [number, number, number];
  };
}

export function useOrbAnimation({
  size,
  speed,
  wobbleSpeed,
  intensity,
  noiseScale,
  innerRadius,
  parsedColors,
}: OrbAnimationOptions) {
  const time = useSharedValue(0);

  useFrameCallback((frameInfo: FrameInfo) => {
    if (frameInfo.timeSincePreviousFrame !== null) {
      time.value += frameInfo.timeSincePreviousFrame * 0.001 * speed;
    }
  });

  const uniforms = useDerivedValue<Uniforms>(() => {
    return {
      iTime: time.value,
      iResolution: [size, size],
      color1: parsedColors.c1,
      color2: parsedColors.c2,
      color3: parsedColors.c3,
      noiseScale,
      innerRadius,
      intensity,
      noiseSpeed: wobbleSpeed,
    };
  });

  return uniforms;
}
