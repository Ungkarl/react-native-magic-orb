import { View, StyleSheet } from 'react-native';
import type { ViewStyle } from 'react-native';
import type { SkRuntimeEffect } from '@shopify/react-native-skia';
import type { ColorSchemeName } from './colors';
import { resolveColors } from './palette';
import type { OrbColors } from './palette';
import { useOrbAnimation } from './useOrbAnimation';
import { OrbCanvas } from './OrbCanvas';

/** Props shared by every orb component. */
export interface BaseOrbProps {
  /** Preset color palette. Takes priority over `colors` and `color`. */
  colorScheme?: ColorSchemeName;
  /** 2–5 hex colors used to paint the orb. Takes priority over `color`. */
  colors?: OrbColors;
  /** One hex color; a matching palette is generated from it. */
  color?: string;
  /** Rotates all colors around the color wheel, in degrees per second. 0 (default) is off. */
  hueShift?: number;
  /** Width and height in logical pixels. */
  size?: number;
  /** Global time multiplier for all animation. */
  speed?: number;
  /** How quickly the surface noise evolves. */
  wobbleSpeed?: number;
  /** Amplitude of the shape distortion. */
  intensity?: number;
  /** Spatial frequency of the surface noise. */
  noiseScale?: number;
  /** Radius of the dark inner core as a fraction of the orb size (0–1). */
  innerRadius?: number;
  /** Additional styles for the outer container. */
  style?: ViewStyle;
}

interface OrbBaseProps extends BaseOrbProps {
  shader: SkRuntimeEffect | null;
  glowIntensity: number;
}

/** Internal: the shared rendering pipeline. Each public orb component picks a shader. */
export function OrbBase({
  shader,
  glowIntensity,
  colorScheme,
  colors,
  color,
  hueShift = 0,
  size = 300,
  speed = 1.0,
  wobbleSpeed = 0.5,
  intensity = 0.4,
  noiseScale = 0.85,
  innerRadius = 0.6,
  style,
}: OrbBaseProps) {
  const uniforms = useOrbAnimation({
    size,
    speed,
    wobbleSpeed,
    intensity,
    noiseScale,
    innerRadius,
    glowIntensity,
    colors: resolveColors({ colorScheme, colors, color }),
    hueShift,
  });

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <OrbCanvas size={size} uniforms={uniforms} shader={shader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignSelf: 'center',
  },
});
