# Changelog

# [0.4.0](https://github.com/Ungkarl/react-native-magic-orb/compare/v0.3.0...v0.4.0) (2026-11-04)


### Bug Fixes

* give each color in Orb its own life ([#8](https://github.com/Ungkarl/react-native-magic-orb/issues/8)) ([621b471](https://github.com/Ungkarl/react-native-magic-orb/commit/621b4711251fbaa286e60fc27679780b3b4d0ea8))
* keep Orb's ring intact at any prop values ([#7](https://github.com/Ungkarl/react-native-magic-orb/issues/7)) ([1bca5f8](https://github.com/Ungkarl/react-native-magic-orb/commit/1bca5f8874c31ab6e20b884db55256abe426c869))


### Features

* pause, Reduce Motion, accessibility, and lazy shaders ([#9](https://github.com/Ungkarl/react-native-magic-orb/issues/9)) ([b91cd20](https://github.com/Ungkarl/react-native-magic-orb/commit/b91cd205d7d0dbf6c7fc32f90b7a84daa3dd2623))

# [0.3.0](https://github.com/Ungkarl/react-native-magic-orb/compare/v0.2.0...v0.3.0) (2026-11-04)


### Features

* 2-5 colors, palette from one color, and hue shifting ([#5](https://github.com/Ungkarl/react-native-magic-orb/issues/5)) ([14f8534](https://github.com/Ungkarl/react-native-magic-orb/commit/14f853480bbb2837a73da9015ea8333a1106e754))

# [0.2.0](https://github.com/Ungkarl/react-native-magic-orb/compare/v0.1.8...v0.2.0) (2026-11-04)

### Features

* polished Orb with living colors and glow, plus ClassicOrb ([41ff4dc](https://github.com/Ungkarl/react-native-magic-orb/commit/41ff4dc69edba1988dd98dd81e963621633d128f))
  * `Orb` uses all three colors, which melt into each other around the ring
  * two wandering highlights that change speed, direction and size, and fade in and out
  * animated outer glow, with new `glow` and `glowIntensity` props
  * new `ClassicOrb` component with the original look

### Upgrade note

`<Orb />` looks different after upgrading. To keep the previous look, switch to
`<ClassicOrb />` with the same props. No props were removed or renamed.

# 0.1.0 – 0.1.8

Initial releases: the animated `Orb` component, its customization props
(`size`, `speed`, `wobbleSpeed`, `intensity`, `noiseScale`, `innerRadius`), the
`colors` and `colorScheme` props, and 15 preset color schemes. See the
[GitHub history](https://github.com/Ungkarl/react-native-magic-orb/commits/v0.1.8) for details.
