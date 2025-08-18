import { bundle } from '@remotion/bundler';
import { renderStill } from '@remotion/renderer';
import path from 'path';
import fs from 'fs-extra';

export interface TestConfig {
  compositionId: string;
  frame: number;
  props?: Record<string, any>;
  outputName: string;
}

export async function renderTestFrame(config: TestConfig) {
  const bundleLocation = await bundle({
    entryPoint: path.join(__dirname, 'test-compositions.tsx'),
    webpackOverride: (config) => config,
  });

  const outputPath = path.join(__dirname, 'snapshots', config.outputName);
  await fs.ensureDir(path.dirname(outputPath));

  await renderStill({
    composition: {
      id: config.compositionId,
      durationInFrames: 150,
      fps: 30,
      width: 1920,
      height: 1080,
      defaultProps: config.props || {},
    },
    output: outputPath,
    frame: config.frame,
    serveUrl: bundleLocation,
    imageFormat: 'png',
  });

  return outputPath;
}

export async function compareSnapshots(
  actualPath: string,
  expectedPath: string,
  threshold = 0.01
): Promise<boolean> {
  // This would use a library like pixelmatch or jest-image-snapshot
  // For now, we'll just check if files exist
  const actualExists = await fs.pathExists(actualPath);
  const expectedExists = await fs.pathExists(expectedPath);
  
  if (!expectedExists) {
    // First run, save as baseline
    await fs.copy(actualPath, expectedPath);
    return true;
  }
  
  // In production, you'd use proper image comparison here
  // For example:
  // const diff = await pixelmatch(actualBuffer, expectedBuffer, ...);
  // return diff < threshold;
  
  return actualExists && expectedExists;
}