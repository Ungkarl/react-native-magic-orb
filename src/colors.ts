export type ColorSchemeName =
  | 'default'
  | 'aurora'
  | 'fire'
  | 'cyberpunk'
  | 'ocean'
  | 'nebula'
  | 'toxic';

export const COLOR_SCHEMES: Record<ColorSchemeName, [string, string, string]> =
  {
    default: ['#339999', '#194c4c', '#7df7ff'],
    aurora: ['#00ff9d', '#0040ff', '#8000ff'],
    fire: ['#ff0000', '#ff5a00', '#ffcc00'],
    cyberpunk: ['#00F5FF', '#9D00FF', '#FF00C8'],
    ocean: ['#004e92', '#000428', '#00a8ff'],
    nebula: ['#0b0b2a', '#2b00ff', '#cc00ff'],
    toxic: ['#39ff14', '#1f5900', '#bfff00'],
  };

export const hexToVec3 = (hex: string): [number, number, number] => {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  return [r, g, b];
};
