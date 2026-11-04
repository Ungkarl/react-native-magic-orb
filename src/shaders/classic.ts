import { Skia } from '@shopify/react-native-skia';
import { classicSksl } from './classic.sksl';

export const classicShader = Skia.RuntimeEffect.Make(classicSksl);
