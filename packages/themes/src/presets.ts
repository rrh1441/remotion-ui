export interface AspectPreset {
  id: string;
  name: string;
  width: number;
  height: number;
  safeArea?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export const ASPECT_PRESETS: Record<string, AspectPreset> = {
  square: {
    id: 'square',
    name: 'Square (1:1)',
    width: 1080,
    height: 1080,
  },
  vertical: {
    id: 'vertical',
    name: 'Vertical (9:16)',
    width: 1080,
    height: 1920,
    safeArea: {
      top: 140,
      right: 60,
      bottom: 220,
      left: 60,
    },
  },
  web: {
    id: 'web',
    name: 'Web (16:9)',
    width: 1920,
    height: 1080,
  },
  tall: {
    id: 'tall',
    name: 'Tall (4:5)',
    width: 1080,
    height: 1350,
  },
  slide: {
    id: 'slide',
    name: 'Slide (3:4)',
    width: 1080,
    height: 1440,
  },
  wide: {
    id: 'wide',
    name: 'Wide (21:9)',
    width: 2560,
    height: 1080,
  },
};