<div align="center">

<h1>react-native-magic-orb</h1>

[![npm version](https://img.shields.io/npm/v/react-native-magic-orb.svg?style=flat-square)](https://www.npmjs.com/package/react-native-magic-orb)
[![npm downloads](https://img.shields.io/npm/dm/react-native-magic-orb.svg?style=flat-square)](https://www.npmjs.com/package/react-native-magic-orb)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

A beautiful, highly-customizable animated orb component for React Native, powered by 60fps Skia shaders and Reanimated. Inspired by the Apple Intelligence and Siri animations.

<br />

<div style="display:flex;gap:12px;align-items:center;justify-content:center;flex-wrap:nowrap">
  <img src="https://github.com/user-attachments/assets/c2c8b07b-d4f3-41f4-9925-448b14e04f96" alt="Simulator recording 1" style="height:340px;object-fit:cover;border-radius:12px" />
  <img src="https://github.com/user-attachments/assets/07f09daa-bad0-4bf1-95b7-b6866461ec27" alt="Simulator recording 2" style="height:340px;object-fit:cover;border-radius:12px" />
  <img src="https://github.com/user-attachments/assets/fc3479d1-bb99-4d1e-9764-6dd1bbf75c80" alt="Simulator recording 3" style="height:340px;object-fit:cover;border-radius:12px" />
  <img src="https://github.com/user-attachments/assets/cf82413b-9901-45df-90af-1b45e070c77b" alt="Simulator recording 4" style="height:340px;object-fit:cover;border-radius:12px" />
  <img src="https://github.com/user-attachments/assets/812e8cbb-9469-4854-8752-6175b993cd73" alt="Simulator recording 5" style="height:340px;object-fit:cover;border-radius:12px" />
</div>

</div>

<br />




## 💡 Use Cases

- AI and voice assistant interfaces that need a living, breathing visual indicator
- Meditation and mindfulness apps requiring a calm, fluid focal point
- Loading and processing states where a static spinner is not engaging enough
- Music players and audio visualizers that want to react to sound or rhythm

## 📦 Prerequisites

This library requires the following peer dependencies to be installed in your project:

- [`@shopify/react-native-skia`](https://shopify.github.io/react-native-skia/) — provides the GPU-accelerated canvas and shader runtime
- [`react-native-reanimated`](https://docs.swmansion.com/react-native-reanimated/) — drives the per-frame animation loop at 60fps

## 🔧 Installation

```sh
npm install react-native-magic-orb
```

## 🚀 Usage

```tsx
import { Orb } from 'react-native-magic-orb';

// Basic usage — renders the default teal orb at 300×300
<Orb />

// With a preset color scheme
<Orb colorScheme="aurora" size={250} />

// With custom hex colors
<Orb colors={['#ff0080', '#7928ca', '#0070f3']} size={300} />

// Fully configured
<Orb
  colorScheme="cyberpunk"
  size={320}
  speed={1.2}
  wobbleSpeed={0.7}
  intensity={0.65}
  noiseScale={1.1}
  innerRadius={0.45}
  style={{ marginTop: 32 }}
/>
```

## ⚙️ Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `colorScheme` | `ColorSchemeName` | — | Preset color palette. When set, overrides the `colors` prop. |
| `colors` | `[string, string, string]` | `['#339999', '#194c4c', '#7df7ff']` | Tuple of three hex color strings used to paint the orb surface. |
| `size` | `number` | `300` | Width and height of the orb in logical pixels. |
| `speed` | `number` | `1.0` | Global time multiplier. Scales the rate of all animations uniformly. |
| `wobbleSpeed` | `number` | `0.5` | How quickly the surface noise pattern evolves over time. Higher values produce faster, more restless movement. |
| `intensity` | `number` | `0.4` | Amplitude of the shape distortion. Controls how aggressively the orb edge stretches and bubbles outward — higher values produce more dramatic morphing. Using a high value will make the shape break. |
| `noiseScale` | `number` | `0.85` | Spatial frequency of the surface noise. Lower values produce large, smooth blobs; higher values produce finer, more complex surface detail. |
| `innerRadius` | `number` | `0.6` | Radius of the dark inner core as a fraction of the orb size (0–1). Larger values shrink the luminous shell toward the edge. |
| `style` | `ViewStyle` | — | Additional styles applied to the outer container `View`. |

## 🎨 Color Schemes

| Name | Vibe |
|------|------|
| `default` | Teal and cyan — calm, balanced |
| `aurora` | Emerald green to deep violet — northern lights |
| `fire` | Deep red to golden yellow — heat and energy |
| `cyberpunk` | Electric cyan to neon magenta — high-contrast futurism |
| `ocean` | Navy to bright blue — deep water |
| `nebula` | Near-black indigo to bright purple — outer space |
| `toxic` | Neon green to acid yellow — radioactive glow |

## 🤝 Contributing

- [Development workflow](CONTRIBUTING.md#development-workflow)
- [Sending a pull request](CONTRIBUTING.md#sending-a-pull-request)
- [Code of conduct](CODE_OF_CONDUCT.md)

## License

MIT
