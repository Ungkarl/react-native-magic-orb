import { Canvas, Fill, Shader } from '@shopify/react-native-skia';
import type { SkRuntimeEffect, Uniforms } from '@shopify/react-native-skia';
import type { SharedValue } from 'react-native-reanimated';

interface OrbCanvasProps {
  size: number;
  uniforms: SharedValue<Uniforms>;
  shader: SkRuntimeEffect | null;
}

export function OrbCanvas({ size, uniforms, shader }: OrbCanvasProps) {
  if (!shader) {
    return null;
  }

  return (
    <Canvas style={{ width: size, height: size }}>
      <Fill>
        <Shader source={shader} uniforms={uniforms} />
      </Fill>
    </Canvas>
  );
}
