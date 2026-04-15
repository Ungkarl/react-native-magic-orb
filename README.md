# react-native-magic-orb
[![npm version](https://img.shields.io/npm/v/react-native-magic-orb.svg?style=flat-square)](https://www.npmjs.com/package/react-native-magic-orb)
[![npm downloads](https://img.shields.io/npm/dm/react-native-magic-orb.svg?style=flat-square)](https://www.npmjs.com/package/react-native-magic-orb)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

A beautiful, animated orb/sphere component for React Native — powered by Skia shaders and Reanimated. Inspired by the Apple Intelligence orb animation.

<br />



https://github.com/user-attachments/assets/ae25a2ed-0f61-4373-bbcb-5c3ddecc4c92



<br />







## Prerequisites

This library requires the following peer dependencies to be installed in your project:

- [`@shopify/react-native-skia`](https://shopify.github.io/react-native-skia/)
- [`react-native-reanimated`](https://docs.swmansion.com/react-native-reanimated/)

## Installation

```sh
npm install react-native-magic-orb
```

## Usage

```tsx
import { Orb } from 'react-native-magic-orb';

// Basic usage
<Orb />

// With a preset color scheme
<Orb colorScheme="aurora" size={250} />

// With custom colors
<Orb colors={['#ff0080', '#7928ca', '#0070f3']} size={300} />

// Fully configured
<Orb
  colorScheme="cyberpunk"
  size={300}
  speed={1.2}
  wobbleSpeed={0.6}
  intensity={0.5}
  noiseScale={0.9}
  innerRadius={0.55}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `colorScheme` | `ColorSchemeName` | — | Preset color palette. Overrides `colors` when set. |
| `colors` | `[string, string, string]` | `['#339999', '#194c4c', '#7df7ff']` | Array of 3 hex color strings for the orb. |
| `size` | `number` | `300` | Width and height of the orb in pixels. |
| `speed` | `number` | `1.0` | Overall animation speed multiplier. |
| `wobbleSpeed` | `number` | `0.5` | Speed of the noise/wobble animation. |
| `intensity` | `number` | `0.4` | Intensity of the glow and light effects. |
| `noiseScale` | `number` | `0.85` | Scale of the surface noise detail. |
| `innerRadius` | `number` | `0.6` | Radius of the inner dark core (0–1). |
| `style` | `ViewStyle` | — | Additional styles applied to the container. |

## Color Schemes

| Name | Description |
|------|-------------|
| `default` | Teal/cyan |
| `aurora` | Green to violet |
| `fire` | Red to yellow |
| `cyberpunk` | Cyan to magenta |
| `ocean` | Deep blue |
| `nebula` | Dark indigo to purple |
| `toxic` | Neon green |

## Contributing

- [Development workflow](CONTRIBUTING.md#development-workflow)
- [Sending a pull request](CONTRIBUTING.md#sending-a-pull-request)
- [Code of conduct](CODE_OF_CONDUCT.md)

## License

MIT
