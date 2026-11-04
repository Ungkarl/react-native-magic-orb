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
- [`react-native-worklets`](https://docs.swmansion.com/react-native-worklets/) — required by Reanimated 4 to run the animation on the UI thread

Tested with Expo SDK 58, React Native 0.88, Skia 2.14, Reanimated 4.7 and Worklets 0.13.

## 🔧 Installation

### Expo

```sh
npx expo install react-native-magic-orb @shopify/react-native-skia react-native-reanimated react-native-worklets
```

`npx expo install` picks the Skia, Reanimated and Worklets versions that match your Expo SDK. No extra setup is needed: `babel-preset-expo` already configures Reanimated. It works in Expo Go as well as in development builds.

### Bare React Native

```sh
npm install react-native-magic-orb @shopify/react-native-skia react-native-reanimated react-native-worklets
```

Add the Worklets Babel plugin to `babel.config.js`. It must be the last plugin:

```js
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: ['react-native-worklets/plugin'],
};
```

Then install the iOS pods and rebuild the app:

```sh
cd ios && pod install
```

If you use Reanimated 3, the plugin is `react-native-reanimated/plugin` instead, and you can skip `react-native-worklets`. See the [Reanimated installation guide](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started) for details.

## 🚀 Usage

```tsx
import { Orb } from 'react-native-magic-orb';

// Basic usage — renders the default teal orb at 300×300
<Orb />

// With a preset color scheme
<Orb colorScheme="aurora" size={250} />

// With custom hex colors (2–5)
<Orb colors={['#ff0080', '#7928ca', '#0070f3']} size={300} />
<Orb colors={['#00f5ff', '#2b6cff', '#9d00ff', '#ff00c8', '#ffb800']} />

// From a single color: a matching palette is generated
<Orb color="#7c3aed" />

// Colors slowly travel around the color wheel (degrees per second)
<Orb colorScheme="aurora" hueShift={30} />

// Fully configured
<Orb
  colorScheme="cyberpunk"
  size={320}
  speed={1.2}
  wobbleSpeed={0.7}
  intensity={0.65}
  noiseScale={1.1}
  innerRadius={0.45}
  glowIntensity={1.4}
  style={{ marginTop: 32 }}
/>
```

### Components

| Component | Look |
|-----------|------|
| `Orb` | A glowing ring whose colors melt into each other, with two wandering highlights and an animated outer glow. |
| `ClassicOrb` | The original orb from versions before 0.2.0: a two-color ring with a single orbiting highlight. Same props as `Orb`, minus `glow` and `glowIntensity`. |

```tsx
import { ClassicOrb } from 'react-native-magic-orb';

<ClassicOrb colorScheme="aurora" />
```

### Palettes from one color

`generatePalette` returns the same palette the `color` prop uses, if you want to reuse it elsewhere in your UI:

```tsx
import { generatePalette } from 'react-native-magic-orb';

generatePalette('#7c3aed');    // 3 colors, including '#7c3aed'
generatePalette('#7c3aed', 5); // 2–5 colors
```

Colors are spread across neighbouring hues with a gentle lightness ramp, calculated in OKLCH so the steps look even to the eye.

## ⚙️ Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `colorScheme` | `ColorSchemeName` | — | Preset color palette. Takes priority over `colors` and `color`. |
| `colors` | `OrbColors` (2–5 hex strings) | `['#339999', '#194c4c', '#7df7ff']` | Hex colors used to paint the orb. `Orb` uses all of them; `ClassicOrb` uses the first two. Takes priority over `color`. |
| `color` | `string` | — | A single hex color. A matching 3-color palette is generated from it (see `generatePalette`). |
| `hueShift` | `number` | `0` | Rotates all colors around the color wheel over time, in degrees per second. `0` is off; `30` takes 12 seconds per full cycle. Lightness is kept, so the palette's character stays the same. |
| `size` | `number` | `300` | Width and height of the orb in logical pixels. |
| `speed` | `number` | `1.0` | Global time multiplier. Scales the rate of all animations uniformly. |
| `wobbleSpeed` | `number` | `0.5` | How quickly the surface noise pattern evolves over time. Higher values produce faster, more restless movement. |
| `intensity` | `number` | `0.4` | Amplitude of the shape distortion. Controls how aggressively the orb edge stretches and bubbles outward — higher values produce more dramatic morphing. Using a high value will make the shape break. |
| `noiseScale` | `number` | `0.85` | Spatial frequency of the surface noise. Lower values produce large, smooth blobs; higher values produce finer, more complex surface detail. |
| `innerRadius` | `number` | `0.6` | Radius of the dark inner core as a fraction of the orb size (0–1). Larger values shrink the luminous shell toward the edge. |
| `glow` | `boolean` | `true` | Renders a soft, animated glow around the orb's rim. Set to `false` to turn it off. `Orb` only. |
| `glowIntensity` | `number` | `0.7` | Strength of the glow. `0` hides it; values up to about `2` give a stronger halo. Ignored when `glow` is `false`. `Orb` only. |
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
| `sunset` | Coral, rose and orange — warm evening sky |
| `synthwave` | Peach, neon purple and turquoise — retro 80s |
| `ghost` | Charcoal, grey and white — subtle, monochrome |
| `forest` | Deep teal to sage and mint — calm, natural |
| `supernova` | Deep blue, crimson and gold — explosive contrast |
| `glacier` | Sky blue, mint and ice white — cool and fresh |
| `bloodMoon` | Near-black to bright red — dark and intense |
| `gold` | Dark gold to pale champagne — premium, metallic |


## 🛣️ Roadmap
- [x] Initial release with core animation and customization features
- [x] Additional preset color schemes
- [x] Support for up to 5 colors and down to 2 colors for more variety
- [x] Auto Color Generation based on a single input color
- [x] Dynamic Color Mode that shifts hues over time
- [ ] A fix for the shape breaking when some of the props are set to high values
- [x] Make color glow / gradient more dynamic than just a animating circle.
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
