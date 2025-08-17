export interface SafeArea {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface AspectPreset {
  id: string;
  name: string;
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
  safeArea?: SafeArea;
  description?: string;
}

export const ASPECT_PRESETS: Record<string, AspectPreset> = {
  square: {
    id: 'square',
    name: 'Square (1:1)',
    width: 1080,
    height: 1080,
    fps: 30,
    durationInFrames: 150,
    description: 'Perfect for Instagram posts and social media squares',
  },
  vertical: {
    id: 'vertical',
    name: 'Vertical (9:16)',
    width: 1080,
    height: 1920,
    fps: 30,
    durationInFrames: 150,
    safeArea: {
      top: 140,
      right: 60,
      bottom: 220,
      left: 60,
    },
    description: 'Optimized for Instagram Stories, TikTok, and YouTube Shorts',
  },
  web: {
    id: 'web',
    name: 'Web (16:9)',
    width: 1920,
    height: 1080,
    fps: 30,
    durationInFrames: 150,
    description: 'Standard HD format for YouTube, web, and presentations',
  },
  tall: {
    id: 'tall',
    name: 'Tall (4:5)',
    width: 1080,
    height: 1350,
    fps: 30,
    durationInFrames: 150,
    description: 'Instagram and Facebook feed optimized aspect ratio',
  },
  slide: {
    id: 'slide',
    name: 'Slide (3:4)',
    width: 1080,
    height: 1440,
    fps: 30,
    durationInFrames: 150,
    description: 'Presentation slide format, great for educational content',
  },
  wide: {
    id: 'wide',
    name: 'Wide (21:9)',
    width: 2560,
    height: 1080,
    fps: 30,
    durationInFrames: 150,
    description: 'Cinematic ultra-wide format',
  },
};

export const getPresetById = (id: string): AspectPreset | undefined => {
  return ASPECT_PRESETS[id];
};

export const getPresetNames = (): string[] => {
  return Object.keys(ASPECT_PRESETS);
};

export const getPresetsForPlatform = (platform: 'instagram' | 'tiktok' | 'youtube' | 'twitter'): AspectPreset[] => {
  const platformPresets: Record<string, string[]> = {
    instagram: ['square', 'vertical', 'tall'],
    tiktok: ['vertical'],
    youtube: ['web', 'vertical'],
    twitter: ['web', 'square'],
  };
  
  const presetIds = platformPresets[platform] || [];
  return presetIds.map(id => ASPECT_PRESETS[id]).filter(Boolean);
};