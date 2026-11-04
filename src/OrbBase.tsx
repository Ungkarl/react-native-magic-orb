import { View, StyleSheet } from 'react-native';
import type { ViewStyle } from 'react-native';
import type { SkRuntimeEffect } from '@shopify/react-native-skia';
import type { ColorSchemeName } from './colors';
import { resolveColors } from './palette';
import type { OrbColors } from './palette';
import { useReducedMotion } from 'react-native-reanimated';
import { useOrbAnimation } from './useOrbAnimation';
import { useAppActive } from './useAppActive';
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
  /**
   * Freezes the animation on its current frame. While paused (and while the app is in
   * the background) nothing is computed or redrawn. Default `false`.
   */
  paused?: boolean;
  /**
   * How to respond to the system "Reduce Motion" setting. `'system'` (default) plays the
   * animation at a quarter speed when it is on; `'always'` always does; `'never'` ignores it.
   */
  reduceMotion?: 'system' | 'always' | 'never';
  /** Read by screen readers. When set, the orb is exposed as an image with this label. */
  accessibilityLabel?: string;
  /** Used to find the orb in end-to-end tests. */
  testID?: string;
  /** Additional styles for the outer container. */
  style?: ViewStyle;
}

/** Animation speed multiplier while motion is reduced. */
const REDUCED_MOTION_SPEED = 0.25;

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
  paused = false,
  reduceMotion = 'system',
  accessibilityLabel,
  testID,
  style,
}: OrbBaseProps) {
  const appActive = useAppActive();
  const systemReducedMotion = useReducedMotion();
  const reduced =
    reduceMotion === 'always' ||
    (reduceMotion === 'system' && systemReducedMotion);

  const uniforms = useOrbAnimation({
    size,
    speed: reduced ? speed * REDUCED_MOTION_SPEED : speed,
    wobbleSpeed,
    intensity,
    noiseScale,
    innerRadius,
    glowIntensity,
    colors: resolveColors({ colorScheme, colors, color }),
    hueShift,
    running: appActive && !paused,
  });

  return (
    <View
      style={[styles.container, { width: size, height: size }, style]}
      testID={testID}
      accessible={accessibilityLabel !== undefined}
      accessibilityRole={accessibilityLabel !== undefined ? 'image' : undefined}
      accessibilityLabel={accessibilityLabel}
    >
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
