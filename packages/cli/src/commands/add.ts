import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import prompts from 'prompts';
import { logger } from '../utils/logger';
import { copyFile, getTemplatesDir } from '../utils/files';

const AVAILABLE_COMPONENTS = [
  'title-card',
  'lower-third',
  'stat-block',
  'kpi-strip',
  'quote-block',
  'list-reveal',
  'progress-bar',
  'end-card',
  'device-frame',
  'cross-fade',
  'dip-to-color',
  'push',
  'wipe',
  'fade-in',
  'fade-out',
  'slide-in',
  'slide-out',
  'scale-in',
  'scale-out',
  'stack',
  'stagger',
  'timeline-gate',
];

const COMPONENT_MAP: Record<string, string> = {
  'title-card': 'components/TitleCard.tsx',
  'lower-third': 'components/LowerThird.tsx',
  'stat-block': 'components/StatBlock.tsx',
  'kpi-strip': 'components/KPIStrip.tsx',
  'quote-block': 'components/QuoteBlock.tsx',
  'list-reveal': 'components/ListReveal.tsx',
  'progress-bar': 'components/ProgressBar.tsx',
  'end-card': 'components/EndCard.tsx',
  'device-frame': 'components/DeviceFrame.tsx',
  'cross-fade': 'components/transitions/CrossFade.tsx',
  'dip-to-color': 'components/transitions/DipToColor.tsx',
  'push': 'components/transitions/Push.tsx',
  'wipe': 'components/transitions/Wipe.tsx',
  'fade-in': 'core/primitives/FadeIn.tsx',
  'fade-out': 'core/primitives/FadeOut.tsx',
  'slide-in': 'core/primitives/SlideIn.tsx',
  'slide-out': 'core/primitives/SlideOut.tsx',
  'scale-in': 'core/primitives/ScaleIn.tsx',
  'scale-out': 'core/primitives/ScaleOut.tsx',
  'stack': 'core/primitives/Stack.tsx',
  'stagger': 'core/primitives/Stagger.tsx',
  'timeline-gate': 'core/primitives/TimelineGate.tsx',
};

export interface AddOptions {
  path: string;
  overwrite?: boolean;
}

export const add = async (components: string[], options: AddOptions) => {
  if (!components || components.length === 0) {
    const response = await prompts({
      type: 'multiselect',
      name: 'components',
      message: 'Select components to add:',
      choices: AVAILABLE_COMPONENTS.map(comp => ({
        title: comp,
        value: comp,
      })),
    });
    
    if (!response.components || response.components.length === 0) {
      logger.info('No components selected.');
      return;
    }
    
    components = response.components;
  }
  
  const spinner = logger.spinner('Adding components...').start();
  
  try {
    const projectRoot = process.cwd();
    const targetPath = path.join(projectRoot, options.path);
    const templatesDir = getTemplatesDir();
    
    let addedCount = 0;
    let skippedCount = 0;
    
    for (const component of components) {
      const componentPath = COMPONENT_MAP[component];
      
      if (!componentPath) {
        logger.warn(`Unknown component: ${component}`);
        continue;
      }
      
      const source = path.join(templatesDir, componentPath);
      const dest = path.join(targetPath, componentPath);
      
      const copied = await copyFile(source, dest, options.overwrite);
      
      if (copied) {
        addedCount++;
        spinner.text = `Added ${component}`;
      } else {
        skippedCount++;
        spinner.text = `Skipped ${component} (already exists)`;
      }
    }
    
    spinner.succeed(`Added ${addedCount} component(s)`);
    
    if (skippedCount > 0) {
      logger.info(`${skippedCount} component(s) already existed and were skipped.`);
      logger.info(`Use --overwrite to replace existing files.`);
    }
    
    console.log('');
    logger.success('Components added successfully!');
    console.log('');
    logger.info('Import components from:');
    components.forEach(comp => {
      const componentPath = COMPONENT_MAP[comp];
      if (componentPath) {
        const importPath = path.join(options.path, componentPath).replace(/\.tsx$/, '');
        console.log(chalk.gray(`  import { ... } from '${importPath}';`));
      }
    });
    
  } catch (error) {
    spinner.fail('Failed to add components');
    logger.error(String(error));
    process.exit(1);
  }
};