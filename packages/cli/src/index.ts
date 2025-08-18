#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { init } from './commands/init';
import { add } from './commands/add';
import { addPreset } from './commands/add-preset';
import { addAssets } from './commands/add-assets';

const program = new Command();

program
  .name('remotion-ui')
  .description('CLI for Remotion UI - copy components and assets into your project')
  .version('0.1.0');

program
  .command('init')
  .description('Initialize Remotion UI in your project')
  .option('--path <path>', 'Path to install components', 'src/remotion/ui')
  .option('--tailwind', 'Configure Tailwind CSS with design tokens')
  .option('--yes', 'Skip confirmation prompts')
  .action(init);

program
  .command('add [components...]')
  .description('Add components to your project')
  .option('--path <path>', 'Path to install components', 'src/remotion/ui')
  .option('--overwrite', 'Overwrite existing files')
  .action(add);

program
  .command('add-preset [presets...]')
  .description('Add aspect ratio presets to your project')
  .option('--path <path>', 'Path to install presets', 'src/remotion/ui')
  .action(addPreset);

program
  .command('add-assets [packs...]')
  .description('Add asset packs to your project')
  .option('--path <path>', 'Path to install assets', 'public/assets')
  .option('--overwrite', 'Overwrite existing asset packs')
  .action(addAssets);

program.parse();