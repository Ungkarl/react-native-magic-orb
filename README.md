<div align="center">

<h1>react-native-magic-orb</h1>

[![npm version](https://img.shields.io/npm/v/react-native-magic-orb.svg?style=flat-square)](https://www.npmjs.com/package/react-native-magic-orb)
[![npm downloads](https://img.shields.io/npm/dm/react-native-magic-orb.svg?style=flat-square)](https://www.npmjs.com/package/react-native-magic-orb)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

A beautiful, highly-customizable animated orb component for React Native, powered by 60fps Skia shaders and Reanimated. Inspired by the Apple Intelligence and Siri animations.

<br />

<img src="https://github.com/user-attachments/assets/e7c1fb79-d663-4b1b-abab-6d2a0b11fa61" height="450" alt="react-native-magic-orb animation preview" />

</div>

<br /> 


## 🤔 Why I made it
I created `react-native-magic-orb`, as i needed a living visual indicator for an Ai assistant in a project at work. I found already made ones, that were either not living up to my requirements or behind a paywall. So i decided to make my own, and share it with everyone who might need something like it. Inspiration was drawn from the Apple Intelligence Orb. 


## 💡 Use Cases

- AI and voice assistant interfaces that need a living, breathing visual indicator
- Meditation and mindfulness apps requiring a calm, fluid focal point
- Loading and processing states where a static spinner is not engaging enough


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


## 🛣️ Roadmap
- [x] Initial release with core animation and customization features
- [x] Additional preset color schemes
- [ ] Support for up to 5 colors and down to 2 colors for more variety
- [ ] Auto Color Generation based on a single input color
- [ ] Dynamic Color Mode that shifts hues over time
- [ ] A fix for the shape breaking when some of the props are set to high values
- [ ] Make color glow / gradient more dynamic than just a animating circle.
- [ ] Performance optimizations for lower-end devices
- [ ] Support for React Native Web
- [ ] Touch Interaction mode - make the orb react to being tapped (e.g. ripple effect through shader)
- [ ] Gyroscope Mode - shift lighting or perspective of the orb based on the devices tilt and orientation
- [ ] Custom Lighting Props - expose controls for lighting intensity, attenuation, and color to allow for more dramatic or subtle shading effects
- [ ] Audio Reactive Mode - make the orb pulse and morph in response to ambient sound or music using the device microphone input




## 🤝 Contributing

- [Development workflow](CONTRIBUTING.md#development-workflow)
- [Sending a pull request](CONTRIBUTING.md#sending-a-pull-request)
- [Code of conduct](CODE_OF_CONDUCT.md)

## License

MIT
