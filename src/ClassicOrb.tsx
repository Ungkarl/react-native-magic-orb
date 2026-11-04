import { OrbBase } from './OrbBase';
import type { BaseOrbProps } from './OrbBase';
import { classicShader } from './shaders/classic';

export type ClassicOrbProps = BaseOrbProps;

/**
 * The original orb from versions before 0.2.0: a two-color ring with a single
 * orbiting highlight. Uses the first two colors of the palette.
 */
export function ClassicOrb(props: ClassicOrbProps) {
  return <OrbBase {...props} shader={classicShader} glowIntensity={0} />;
}
