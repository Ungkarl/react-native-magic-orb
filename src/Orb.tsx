import { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import type { ViewStyle } from 'react-native';
import { COLOR_SCHEMES, hexToVec3 } from './colors';
import { useOrbAnimation } from './useOrbAnimation';
import { OrbCanvas } from './OrbCanvas';

export type { ColorSchemeName } from './colors';

export interface OrbProps {
  colorScheme?: import('./colors').ColorSchemeName;
  colors?: [string, string, string];
  size?: number;
  speed?: number;
  wobbleSpeed?: number;
  intensity?: number;
  noiseScale?: number;
  innerRadius?: number;
  /** Render the soft, animated glow around the orb's rim. */
  glow?: boolean;
  /** Strength of the glow. 0 hides it, 1 is the default, values up to ~2 look good. */
  glowIntensity?: number;
  style?: ViewStyle;
}

export function Orb({
  colorScheme,
  colors = ['#339999', '#194c4c', '#7df7ff'],
  size = 300,
  speed = 1.0,
  wobbleSpeed = 0.5,
  intensity = 0.4,
  noiseScale = 0.85,
  innerRadius = 0.6,
  glow = true,
  glowIntensity = 1.0,
  style,
}: OrbProps) {
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
    glowIntensity: glow ? Math.max(0, glowIntensity) : 0,
    parsedColors,
  });

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <OrbCanvas size={size} uniforms={uniforms} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignSelf: 'center',
  },
});
