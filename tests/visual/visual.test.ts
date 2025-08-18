import { describe, it, expect, beforeAll } from 'vitest';
import { renderTestFrame, compareSnapshots } from './setup';
import path from 'path';

describe('Visual Regression Tests', () => {
  const testCases = [
    {
      name: 'TitleCard at frame 30',
      config: {
        compositionId: 'title-card-test',
        frame: 30,
        outputName: 'title-card-30.png',
      }
    },
    {
      name: 'FadeIn at frame 15',
      config: {
        compositionId: 'fade-in-test',
        frame: 15,
        outputName: 'fade-in-15.png',
      }
    },
    {
      name: 'FadeIn at frame 30 (complete)',
      config: {
        compositionId: 'fade-in-test',
        frame: 30,
        outputName: 'fade-in-30.png',
      }
    },
    {
      name: 'BarChart at frame 60',
      config: {
        compositionId: 'bar-chart-test',
        frame: 60,
        outputName: 'bar-chart-60.png',
      }
    },
    {
      name: 'LineChart at frame 60',
      config: {
        compositionId: 'line-chart-test',
        frame: 60,
        outputName: 'line-chart-60.png',
      }
    },
    {
      name: 'LoadingSpinner at frame 45',
      config: {
        compositionId: 'loading-spinner-test',
        frame: 45,
        outputName: 'loading-spinner-45.png',
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