import { Skia } from '@shopify/react-native-skia';
import { orbSksl } from './orb.sksl';

export const orbShader = Skia.RuntimeEffect.Make(orbSksl);
