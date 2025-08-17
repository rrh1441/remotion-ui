import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import prompts from 'prompts';
import { logger } from '../utils/logger';

const AVAILABLE_PRESETS = ['square', 'vertical', 'web', 'tall', 'slide', 'wide'];

export interface AddPresetOptions {
  path: string;
}

export const addPreset = async (presets: string[], options: AddPresetOptions) => {
  if (!presets || presets.length === 0) {
    const response = await prompts({
      type: 'multiselect',
      name: 'presets',
      message: 'Select aspect ratio presets to scaffold:',
      choices: AVAILABLE_PRESETS.map(preset => ({
        title: preset,
        value: preset,
      })),
    });
    
    if (!response.presets || response.presets.length === 0) {
      logger.info('No presets selected.');
      return;
    }
    
    presets = response.presets;
  }
  
  const spinner = logger.spinner('Creating preset compositions...').start();
  
  try {
    const projectRoot = process.cwd();
    const targetPath = path.join(projectRoot, options.path, 'compositions');
    
    await fs.ensureDir(targetPath);
    
    for (const preset of presets) {
      if (!AVAILABLE_PRESETS.includes(preset)) {
        logger.warn(`Unknown preset: ${preset}`);
        continue;
      }
      
      const compositionContent = generatePresetComposition(preset);
      const fileName = `${capitalizeFirst(preset)}Composition.tsx`;
      const filePath = path.join(targetPath, fileName);
      
      await fs.writeFile(filePath, compositionContent);
      spinner.text = `Created ${fileName}`;
    }
    
    spinner.succeed(`Created ${presets.length} preset composition(s)`);
    
    console.log('');
    logger.success('Preset compositions created successfully!');
    console.log('');
    logger.info('Register your compositions in your Root component:');
    presets.forEach(preset => {
      const name = capitalizeFirst(preset);
      console.log(chalk.gray(`  import { ${name}Composition } from '${options.path}/compositions/${name}Composition';`));
    });
    
  } catch (error) {
    spinner.fail('Failed to create preset compositions');
    logger.error(String(error));
    process.exit(1);
  }
};

const capitalizeFirst = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const generatePresetComposition = (preset: string) => {
  const presetDimensions: Record<string, { width: number; height: number }> = {
    square: { width: 1080, height: 1080 },
    vertical: { width: 1080, height: 1920 },
    web: { width: 1920, height: 1080 },
    tall: { width: 1080, height: 1350 },
    slide: { width: 1080, height: 1440 },
    wide: { width: 2560, height: 1080 },
  };
  
  const { width, height } = presetDimensions[preset] || { width: 1920, height: 1080 };
  const name = capitalizeFirst(preset);
  
  return `import React from 'react';
import { Composition } from 'remotion';
import { FramePreset } from '../presets/FramePreset';
import { ASPECT_PRESETS } from '../presets/AspectPresets';
import { ThemeProvider } from '../themes/ThemeProvider';
import { TitleCard } from '../components/TitleCard';

export const ${name}Scene: React.FC = () => {
  return (
    <ThemeProvider>
      <FramePreset preset={ASPECT_PRESETS.${preset}} showSafeArea={false}>
        <TitleCard
          title="Welcome to Remotion UI"
          subtitle="${name} Preset (${width}×${height})"
          startAt={0}
          durationInFrames={90}
        />
      </FramePreset>
    </ThemeProvider>
  );
};

export const ${name}Composition = () => {
  return (
    <Composition
      id="${preset}-demo"
      component={${name}Scene}
      durationInFrames={150}
      fps={30}
      width={${width}}
      height={${height}}
    />
  );
};
`;
};