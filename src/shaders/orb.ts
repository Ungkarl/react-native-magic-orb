import { Skia } from '@shopify/react-native-skia';
import { commonSksl } from './common';

// <Orb />: the ring with living colors, two wandering highlights, an animated glow,
// soft highlight roll-off and dithering.
const source = `${commonSksl}
  uniform float glowIntensity;

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

    // Living colors: one smooth cosine bump per color around the ring. Each color peaks at
    // its center and fades to zero exactly opposite it, so where two colors meet only those
    // two blend (no third-color streaks, no creases). Centers shift so each color's share
    // breathes around a third. Noise bends the layout locally, so there is no rigid
    // rotation, only a slow sway.
    vec2 cdir = uv * invLen;
    float sway = 0.07 * sin(iTime * 0.11) + 0.04 * sin(iTime * 0.23 + 1.0);
    // Kept gentle and low-frequency so the layout never folds back on itself (a fold
    // squeezes a gradient into a hard edge).
    float warp = 0.06 * snoise3(vec3(cdir * 0.7, iTime * 0.15 + 20.0));
    float u = (ang / 6.2831853 + sway + warp) * 6.2831853;
    float wp = iTime * 0.17;
    float w1 = 0.33333 + 0.0333 * sin(wp);
    float w2 = 0.33333 + 0.0333 * sin(wp + 2.0944);
    float c2 = (w1 * 0.5 + w2 * 0.5) * 6.2831853;
    float c3 = (w1 + w2 * 0.5 + (1.0 - w1 - w2) * 0.5) * 6.2831853;
    float sharp = mix(1.6, 2.4, 0.5 + 0.5 * sin(iTime * 0.27 + 0.6));
    // max() guards pow(): rounding can push the base a hair below 0, which is NaN on GPUs.
    float k1 = pow(max(0.5 + 0.5 * cos(u), 0.0), sharp);
    float k2 = pow(max(0.5 + 0.5 * cos(u - c2), 0.0), sharp);
    float k3 = pow(max(0.5 + 0.5 * cos(u - c3), 0.0), sharp);
    vec3 colBase = (color1 * k1 + color2 * k2 + color3 * k3) / max(k1 + k2 + k3, 0.0001);

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
    float patches = 0.75 + 0.5 * (snoise3(vec3(cdir * 1.3, iTime * 0.25)) * 0.5 + 0.5);
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

export const orbShader = Skia.RuntimeEffect.Make(source);
