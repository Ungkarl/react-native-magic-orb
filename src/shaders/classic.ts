import { Skia } from '@shopify/react-native-skia';
import type { SkRuntimeEffect } from '@shopify/react-native-skia';
import { classicSksl } from './classic.sksl';

let shader: SkRuntimeEffect | null | undefined;

/** Compiles the ClassicOrb shader the first time it is needed, then reuses it. */
export function getClassicShader() {
  if (shader === undefined) shader = Skia.RuntimeEffect.Make(classicSksl);
  return shader;
}
