import path from 'path';
import fs from 'fs-extra';
import prompts from 'prompts';
import chalk from 'chalk';
import { logger } from '../utils/logger';
import { copyFile, getTemplatesDir } from '../utils/files';

export interface InitOptions {
  path: string;
  tailwind?: boolean;
  yes?: boolean;
}

export const init = async (options: InitOptions) => {
  const spinner = logger.spinner('Initializing Remotion UI...').start();
  
  try {
    const projectRoot = process.cwd();
    const targetPath = path.join(projectRoot, options.path);
    const templatesDir = getTemplatesDir();
    
    if (!options.yes) {
      const response = await prompts({
        type: 'confirm',
        name: 'confirm',
        message: `Initialize Remotion UI at ${chalk.cyan(options.path)}?`,
        initial: true,
      });
      
      if (!response.confirm) {
        spinner.stop();
        logger.info('Initialization cancelled.');
        return;
      }
    }
    
    spinner.text = 'Creating directories...';
    await fs.ensureDir(targetPath);
    
    spinner.text = 'Copying theme files...';
    const themeSource = path.join(templatesDir, 'themes', 'ThemeProvider.tsx');
    const themeDest = path.join(targetPath, 'themes', 'ThemeProvider.tsx');
    await copyFile(themeSource, themeDest);
    
    spinner.text = 'Copying preset files...';
    const presetsSource = path.join(templatesDir, 'presets');
    const presetsDest = path.join(targetPath, 'presets');
    await fs.ensureDir(presetsDest);
    await copyFile(
      path.join(presetsSource, 'AspectPresets.ts'),
      path.join(presetsDest, 'AspectPresets.ts')
    );
    await copyFile(
      path.join(presetsSource, 'FramePreset.tsx'),
      path.join(presetsDest, 'FramePreset.tsx')
    );
    
    if (options.tailwind) {
      spinner.text = 'Configuring Tailwind CSS...';
      await configureTailwind(projectRoot);
    }
    
    spinner.succeed('Remotion UI initialized successfully!');
    
    console.log('');
    logger.info('Next steps:');
    console.log('  1. Wrap your Remotion root with ThemeProvider:');
    console.log(chalk.gray(`     import { ThemeProvider } from '${options.path}/themes/ThemeProvider';`));
    console.log('');
    console.log('  2. Add components:');
    console.log(chalk.gray('     npx remotion-ui add title-card lower-third'));
    console.log('');
    console.log('  3. Add asset packs:');
    console.log(chalk.gray('     npx remotion-ui add-assets icons@v1 shapes@v1'));
    
  } catch (error) {
    spinner.fail('Failed to initialize Remotion UI');
    logger.error(String(error));
    process.exit(1);
  }
};

const configureTailwind = async (projectRoot: string) => {
  const tailwindConfigPath = path.join(projectRoot, 'tailwind.config.js');
  
  if (!await fs.pathExists(tailwindConfigPath)) {
    logger.warn('tailwind.config.js not found. Skipping Tailwind configuration.');
    return;
  }
  
  logger.info('Tailwind configuration would be updated here (not implemented in this demo)');
};