import { describe, it, expect, beforeAll } from 'vitest';
import { renderTestFrame, compareSnapshots } from './setup';
import path from 'path';

describe('Visual Regression Tests', () => {
  const testCases = [
    // TitleCard - 3 frames
    {
      name: 'TitleCard at frame 15 (enter)',
      config: {
        compositionId: 'title-card-test',
        frame: 15,
        outputName: 'title-card-15-enter.png',
      }
    },
    {
      name: 'TitleCard at frame 50 (steady)',
      config: {
        compositionId: 'title-card-test',
        frame: 50,
        outputName: 'title-card-50-steady.png',
      }
    },
    {
      name: 'TitleCard at frame 120 (exit)',
      config: {
        compositionId: 'title-card-test',
        frame: 120,
        outputName: 'title-card-120-exit.png',
      }
    },
    
    // FadeIn - 3 frames
    {
      name: 'FadeIn at frame 10 (enter)',
      config: {
        compositionId: 'fade-in-test',
        frame: 10,
        outputName: 'fade-in-10-enter.png',
      }
    },
    {
      name: 'FadeIn at frame 30 (steady)',
      config: {
        compositionId: 'fade-in-test',
        frame: 30,
        outputName: 'fade-in-30-steady.png',
      }
    },
    {
      name: 'FadeIn at frame 50 (exit)',
      config: {
        compositionId: 'fade-in-test',
        frame: 50,
        outputName: 'fade-in-50-exit.png',
      }
    },

    // AnimatedNumber - 3 frames
    {
      name: 'AnimatedNumber at frame 15 (enter)',
      config: {
        compositionId: 'animated-number-test',
        frame: 15,
        outputName: 'animated-number-15-enter.png',
      }
    },
    {
      name: 'AnimatedNumber at frame 45 (steady)',
      config: {
        compositionId: 'animated-number-test',
        frame: 45,
        outputName: 'animated-number-45-steady.png',
      }
    },
    {
      name: 'AnimatedNumber at frame 75 (exit)',
      config: {
        compositionId: 'animated-number-test',
        frame: 75,
        outputName: 'animated-number-75-exit.png',
      }
    },

    // ScaleIn - 3 frames
    {
      name: 'ScaleIn at frame 5 (enter)',
      config: {
        compositionId: 'scale-in-test',
        frame: 5,
        outputName: 'scale-in-5-enter.png',
      }
    },
    {
      name: 'ScaleIn at frame 20 (steady)',
      config: {
        compositionId: 'scale-in-test',
        frame: 20,
        outputName: 'scale-in-20-steady.png',
      }
    },
    {
      name: 'ScaleIn at frame 50 (exit)',
      config: {
        compositionId: 'scale-in-test',
        frame: 50,
        outputName: 'scale-in-50-exit.png',
      }
    },

    // StatBlock - 3 frames
    {
      name: 'StatBlock at frame 15 (enter)',
      config: {
        compositionId: 'stat-block-test',
        frame: 15,
        outputName: 'stat-block-15-enter.png',
      }
    },
    {
      name: 'StatBlock at frame 45 (steady)',
      config: {
        compositionId: 'stat-block-test',
        frame: 45,
        outputName: 'stat-block-45-steady.png',
      }
    },
    {
      name: 'StatBlock at frame 75 (exit)',
      config: {
        compositionId: 'stat-block-test',
        frame: 75,
        outputName: 'stat-block-75-exit.png',
      }
    },

    // LowerThird - 3 frames
    {
      name: 'LowerThird at frame 15 (enter)',
      config: {
        compositionId: 'lower-third-test',
        frame: 15,
        outputName: 'lower-third-15-enter.png',
      }
    },
    {
      name: 'LowerThird at frame 45 (steady)',
      config: {
        compositionId: 'lower-third-test',
        frame: 45,
        outputName: 'lower-third-45-steady.png',
      }
    },
    {
      name: 'LowerThird at frame 75 (exit)',
      config: {
        compositionId: 'lower-third-test',
        frame: 75,
        outputName: 'lower-third-75-exit.png',
      }
    },

    // Portrait orientation tests
    {
      name: 'TitleCard Portrait at frame 50 (steady)',
      config: {
        compositionId: 'title-card-test-portrait',
        frame: 50,
        outputName: 'title-card-portrait-50-steady.png',
      }
    },
    {
      name: 'AnimatedNumber Portrait at frame 45 (steady)',
      config: {
        compositionId: 'animated-number-test-portrait',
        frame: 45,
        outputName: 'animated-number-portrait-45-steady.png',
      }
    },
    {
      name: 'StatBlock Portrait at frame 45 (steady)',
      config: {
        compositionId: 'stat-block-test-portrait',
        frame: 45,
        outputName: 'stat-block-portrait-45-steady.png',
      }
    },
  ];

  testCases.forEach(({ name, config }) => {
    it(name, async () => {
      const actualPath = await renderTestFrame(config);
      const expectedPath = path.join(__dirname, 'baselines', config.outputName);
      
      const matches = await compareSnapshots(actualPath, expectedPath);
      expect(matches).toBe(true);
    }, 30000); // 30 second timeout for rendering
  });
});