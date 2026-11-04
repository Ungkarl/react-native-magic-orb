import { Skia } from '@shopify/react-native-skia';

const skslSource = `
  uniform float iTime;
  uniform vec2 iResolution;
  uniform vec3 color1;
  uniform vec3 color2;
  uniform vec3 color3;
  uniform float noiseScale;
  uniform float innerRadius;
  uniform float intensity;
  uniform float noiseSpeed;
  uniform float glowIntensity;

  vec3 hash33(vec3 p3) {
    p3 = fract(p3 * vec3(0.1031, 0.11369, 0.13787));
    p3 += dot(p3, p3.yxz + 19.19);
    return -1.0 + 2.0 * fract(vec3(p3.x + p3.y, p3.x + p3.z, p3.y + p3.z) * p3.zyx);
  }

  float snoise3(vec3 p) {
    const float K1 = 0.333333333;
    const float K2 = 0.166666667;
    vec3 i = floor(p + (p.x + p.y + p.z) * K1);
    vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
    vec3 e = step(vec3(0.0), d0 - d0.yzx);
    vec3 i1 = e * (1.0 - e.zxy);
    vec3 i2 = 1.0 - e.zxy * (1.0 - e);
    vec3 d1 = d0 - (i1 - K2);
    vec3 d2 = d0 - (i2 - K1);
    vec3 d3 = d0 - 0.5;
    vec4 h = max(0.6 - vec4(dot(d0, d0), dot(d1, d1), dot(d2, d2), dot(d3, d3)), 0.0);
    vec4 n = h * h * h * h * vec4(dot(d0, hash33(i)), dot(d1, hash33(i + i1)), dot(d2, hash33(i + i2)), dot(d3, hash33(i + 1.0)));
    return dot(vec4(31.316), n);
  }

  float light1(float intensity, float attenuation, float dist) {
    return intensity / (1.0 + dist * attenuation);
  }
  float light2(float intensity, float attenuation, float dist) {
    return intensity / (1.0 + dist * dist * attenuation);
  }

  // Leaves everything below the knee untouched; only highlights roll off instead of clipping.
  vec3 shoulder(vec3 x) {
    vec3 k = vec3(0.8);
    return min(x, k) + 0.2 * (vec3(1.0) - exp(-max(x - k, 0.0) * 5.0));
  }

  // ~1/255 of noise per pixel to break up banding in the soft gradients.
  float dither(vec2 p) {
    return (fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) / 255.0;
  }

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

    // Highlight 1: wanders along the rim, speeding up, stopping and reversing (its angular
    // velocity swings from about -0.8 to +1.3 rad/s), with a slow clockwise drift overall.
    // Size breathes and it fades in and out.
    float a1 = 1.6 * sin(iTime * 0.31) + 1.1 * sin(iTime * 0.53 + 1.3) - 0.25 * iTime;
    float att1 = mix(2.5, 14.0, 0.5 + 0.5 * sin(iTime * 0.53));
    float s1 = smoothstep(0.1, 0.8, 0.5 + 0.5 * sin(iTime * 0.41));

    // Highlight 2: same idea on its own rhythm with a counter-clockwise drift, so the two
    // cross paths, chase and separate. Never both gone at once.
    float a2 = 3.1 + 1.8 * sin(iTime * 0.27 + 2.0) + 0.9 * sin(iTime * 0.61 + 0.4) + 0.2 * iTime;
    float att2 = mix(3.0, 18.0, 0.5 + 0.5 * sin(iTime * 0.71 + 2.0));
    float s2 = smoothstep(0.1, 0.8, 0.5 + 0.5 * sin(iTime * 0.29 + 2.2));
    s2 = max(s2, 0.35 * (1.0 - s1));

    vec2 pos1 = vec2(cos(a1), sin(a1)) * r0;
    vec2 pos2 = vec2(cos(a2), sin(a2)) * r0;
    float v1 = light2(1.5 * s1, att1, distance(uv, pos1))
             + light2(1.25 * s2, att2, distance(uv, pos2));
    v1 *= light1(1.0, 50.0, d0);

    float v2 = smoothstep(1.0, mix(innerRadius, 1.0, n0 * 0.5), len);
    float v3 = smoothstep(innerRadius, mix(innerRadius, 1.0, 0.5), len);

    vec3 colBase = mix(color1, color2, cl);
    vec3 lightCol = (colBase + v1) * mix(1.0, v2 * v3, 0.1);
    
    lightCol = mix(vec3(0.0), lightCol, v0);

    // Outer glow: a soft halo around the rim plus an outward falloff (no interior fill).
    // It breathes, its reach pulses and brighter patches drift around the ring.
    // Fades out before the canvas edge so it never shows a square cut-off.
    float dr = len - r0;
    float reach = 5.4 + 1.3 * sin(iTime * 0.6);
    float rimSoft = 1.0 / (1.0 + dr * dr * 83.0);
    float glowOut = dr > 0.0 ? exp(-dr * reach) : 0.0;
    float breathe = 0.85 + 0.15 * sin(iTime * 0.9);
    float patches = 0.75 + 0.5 * (snoise3(vec3(uv * invLen * 1.3, iTime * 0.25)) * 0.5 + 0.5);
    float glow = (rimSoft * 0.45 + glowOut * 0.18) * 1.1 * breathe * patches * glowIntensity;
    glow *= 1.0 - smoothstep(0.95, 1.2, len);
    lightCol += (colBase + v1 * 0.5) * glow;

    lightCol = shoulder(lightCol);

    float centerMask = smoothstep(0.0, innerRadius * 0.85, len);
    lightCol *= centerMask;
    lightCol = clamp(lightCol + dither(fragCoord), 0.0, 1.0);
    float alpha = max(max(lightCol.r, lightCol.g), lightCol.b);
    return vec4(lightCol, alpha);
  }
`;

export const orbShader = Skia.RuntimeEffect.Make(skslSource);
