import { OrbBase } from './OrbBase';
import type { BaseOrbProps } from './OrbBase';
import { orbShader } from './shaders/orb';

export type { ColorSchemeName } from './colors';

export interface OrbProps extends BaseOrbProps {
  /** Render the soft, animated glow around the orb's rim. */
  glow?: boolean;
  /** Strength of the glow. 0 hides it, 0.7 is the default, values up to ~2 look good. */
  glowIntensity?: number;
}

/**
 * The orb: a glowing ring with colors that melt into each other, two wandering
 * highlights and an animated glow. For the original look, use `ClassicOrb`.
 */
export function Orb({ glow = true, glowIntensity = 0.7, ...props }: OrbProps) {
  return (
    <OrbBase
      {...props}
      shader={orbShader}
      glowIntensity={glow ? Math.max(0, glowIntensity) : 0}
    />
  );
}
