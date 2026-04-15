export type ColorSchemeName =
  | 'default'
  | 'aurora'
  | 'fire'
  | 'cyberpunk'
  | 'ocean'
  | 'nebula'
  | 'toxic'
  | 'sunset'
  | 'synthwave'
  | 'ghost'
  | 'forest'
  | 'supernova'
  | 'glacier'
  | 'bloodMoon'
  | 'gold';

export const COLOR_SCHEMES: Record<ColorSchemeName, [string, string, string]> =
  {
    default: ['#339999', '#194c4c', '#7df7ff'],
    aurora: ['#00ff9d', '#0040ff', '#8000ff'],
    fire: ['#ff0000', '#ff5a00', '#ffcc00'],
    cyberpunk: ['#00F5FF', '#9D00FF', '#FF00C8'],
    ocean: ['#004e92', '#000428', '#00a8ff'],
    nebula: ['#0b0b2a', '#2b00ff', '#cc00ff'],
    toxic: ['#39ff14', '#1f5900', '#bfff00'],

    sunset: ['#FF512F', '#DD2476', '#FF8C00'],
    synthwave: ['#FF9E5E', '#D902EE', '#20E2D7'],
    ghost: ['#2A2A35', '#8E8E9F', '#FFFFFF'],
    forest: ['#134E5E', '#71B280', '#A8E6CF'],
    supernova: ['#1A2A6C', '#B21F1F', '#FDBB2D'],
    glacier: ['#00C9FF', '#92FE9D', '#E0FFFF'],
    bloodMoon: ['#3E0000', '#8B0000', '#FF1A1A'],
    gold: ['#A67C00', '#BF953F', '#FCF6BA'],
  };

export const hexToVec3 = (hex: string): [number, number, number] => {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  return [r, g, b];
};
