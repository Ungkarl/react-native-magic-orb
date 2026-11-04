import { Skia } from '@shopify/react-native-skia';
import type { SkRuntimeEffect } from '@shopify/react-native-skia';
import { orbSksl } from './orb.sksl';

let shader: SkRuntimeEffect | null | undefined;

/** Compiles the Orb shader the first time it is needed, then reuses it. */
export function getOrbShader() {
  if (shader === undefined) shader = Skia.RuntimeEffect.Make(orbSksl);
  return shader;
}
