import { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import type { ViewStyle } from 'react-native';
import type { SkRuntimeEffect } from '@shopify/react-native-skia';
import { COLOR_SCHEMES, hexToVec3 } from './colors';
import type { ColorSchemeName } from './colors';
import { useOrbAnimation } from './useOrbAnimation';
import { OrbCanvas } from './OrbCanvas';

/** Props shared by every orb component. */
export interface BaseOrbProps {
  /** Preset color palette. When set, overrides `colors`. */
  colorScheme?: ColorSchemeName;
  /** Three hex colors used to paint the orb. */
  colors?: [string, string, string];
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
  colors = ['#339999', '#194c4c', '#7df7ff'],
  size = 300,
  speed = 1.0,
  wobbleSpeed = 0.5,
  intensity = 0.4,
  noiseScale = 0.85,
  innerRadius = 0.6,
  style,
}: OrbBaseProps) {
  const activeColors = colorScheme ? COLOR_SCHEMES[colorScheme] : colors;

  const parsedColors = useMemo(
    () => ({
      c1: hexToVec3(activeColors[0]),
      c2: hexToVec3(activeColors[1]),
      c3: hexToVec3(activeColors[2]),
    }),
    [activeColors]
  );

  const uniforms = useOrbAnimation({
    size,
    speed,
    wobbleSpeed,
    intensity,
    noiseScale,
    innerRadius,
    glowIntensity,
    parsedColors,
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
