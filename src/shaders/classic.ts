import { Skia } from '@shopify/react-native-skia';
import { commonSksl } from './common';

// <ClassicOrb />: the original orb, kept unchanged for anyone who prefers it.
const source = `${commonSksl}
  vec4 main(vec2 fragCoord) {
    vec2 center = iResolution.xy * 0.5;
    float size = min(iResolution.x, iResolution.y);
    vec2 uv = (fragCoord - center) / size * 2.4;

    float ang = atan(uv.y, uv.x);
    float len = length(uv);
    float invLen = len > 0.0 ? 1.0 / len : 0.0;

    float n0 = snoise3(vec3(uv * noiseScale, iTime * noiseSpeed)) * 0.5 + 0.5;

    float minRadius = mix(innerRadius, 1.0, 0.5 - (intensity * 0.5));
    float maxRadius = mix(innerRadius, 1.0, 0.5 + (intensity * 0.5));
    float r0 = mix(minRadius, maxRadius, n0);

    float d0 = distance(uv, (r0 * invLen) * uv);
    float v0 = light1(1.0, 10.0, d0);

    v0 *= smoothstep(r0 * 1.05, r0, len);
    float innerFade = smoothstep(r0 * 0.8, r0 * 0.95, len);
    v0 *= mix(innerFade, 1.0, 0.3);

    float cl = cos(ang + iTime * 2.0) * 0.5 + 0.5;
    float a = iTime * -1.0;
    vec2 pos = vec2(cos(a), sin(a)) * r0;
    float d = distance(uv, pos);
    float v1 = light2(1.5, 5.0, d);
    v1 *= light1(1.0, 50.0, d0);

    float v2 = smoothstep(1.0, mix(innerRadius, 1.0, n0 * 0.5), len);
    float v3 = smoothstep(innerRadius, mix(innerRadius, 1.0, 0.5), len);

    vec3 colBase = mix(color1, color2, cl);
    vec3 lightCol = (colBase + v1) * mix(1.0, v2 * v3, 0.1);

    lightCol = mix(vec3(0.0), lightCol, v0);
    lightCol = clamp(lightCol, 0.0, 1.0);

    float centerMask = smoothstep(0.0, innerRadius * 0.85, len);
    lightCol *= centerMask;
    float alpha = max(max(lightCol.r, lightCol.g), lightCol.b);
    return vec4(lightCol, alpha);
  }
`;

export const classicShader = Skia.RuntimeEffect.Make(source);
