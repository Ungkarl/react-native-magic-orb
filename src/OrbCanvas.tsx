import { Canvas, Fill, Shader } from '@shopify/react-native-skia';
import type { Uniforms } from '@shopify/react-native-skia';
import type { SharedValue } from 'react-native-reanimated';
import { orbShader } from './shader';

interface OrbCanvasProps {
  size: number;
  uniforms: SharedValue<Uniforms>;
}

export function OrbCanvas({ size, uniforms }: OrbCanvasProps) {
  if (!orbShader) {
    return null;
  }

  return (
    <Canvas style={{ width: size, height: size }}>
      <Fill>
        <Shader source={orbShader} uniforms={uniforms} />
      </Fill>
    </Canvas>
  );
}
