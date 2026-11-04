import { OrbBase } from './OrbBase';
import type { BaseOrbProps } from './OrbBase';
import { getOrbShader } from './shaders/orb';

export type { ColorSchemeName } from './colors';

export interface OrbProps extends BaseOrbProps {
  /** Render the soft, animated glow around the orb's rim. */
  glow?: boolean;
  /** Strength of the glow, 0–2. 0 hides it, 0.7 is the default. */
  glowIntensity?: number;
}

/**
 * Ranges where the orb always keeps an intact, good-looking shape. Values outside
 * them are clamped, so no prop combination can break the ring.
 */
export const ORB_LIMITS = {
  intensity: [0, 1],
  noiseScale: [0, 3],
  innerRadius: [0.05, 0.95],
  glowIntensity: [0, 2],
} as const;

function clampTo(
  value: number | undefined,
  [min, max]: readonly [number, number]
) {
  return value === undefined ? undefined : Math.min(Math.max(value, min), max);
}

/**
 * The orb: a glowing ring with colors that melt into each other, two wandering
 * highlights and an animated glow. For the original look, use `ClassicOrb`.
 */
export function Orb({
  glow = true,
  glowIntensity = 0.7,
  intensity,
  noiseScale,
  innerRadius,
  ...props
}: OrbProps) {
  return (
    <OrbBase
      {...props}
      intensity={clampTo(intensity, ORB_LIMITS.intensity)}
      noiseScale={clampTo(noiseScale, ORB_LIMITS.noiseScale)}
      innerRadius={clampTo(innerRadius, ORB_LIMITS.innerRadius)}
      shader={getOrbShader()}
      glowIntensity={
        glow ? clampTo(glowIntensity, ORB_LIMITS.glowIntensity)! : 0
      }
    />
  );
}
