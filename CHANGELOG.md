# Changelog

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
