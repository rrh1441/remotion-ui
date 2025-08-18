import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import prompts from 'prompts';
import { logger } from '../utils/logger';
import { getTemplatesDir, copyDirectory } from '../utils/files';

export interface AddAssetsOptions {
  path: string;
  overwrite?: boolean;
}

const AVAILABLE_ASSET_PACKS = {
  'icons@v1': {
    name: 'Icons v1',
    description: '54 icons in outline and solid styles',
    path: 'assets/icons/v1',
    size: '~200KB'
  },
  'shapes@v1': {
    name: 'Shapes v1',
    description: '13 decorative shapes and overlays',
    path: 'assets/shapes/v1',
    size: '~50KB'
  },
  'backgrounds@v1': {
    name: 'Backgrounds v1',
    description: '6 gradients, textures, and patterns',
    path: 'assets/backgrounds/v1',
    size: '~100KB'
  },
  'characters@v1': {
    name: 'Characters v1',
    description: 'Animated character system with personas',
    path: 'assets/characters/v1',
    size: '~500KB'
  },
  'audio@v1': {
    name: 'Audio v1',
    description: 'Sound effects and music loops',
    path: 'assets/audio/v1',
    size: '~2MB'
  }
};

export const addAssets = async (packs: string[], options: AddAssetsOptions) => {
  const availablePacks = Object.keys(AVAILABLE_ASSET_PACKS);
  
  // If no packs specified, show selection prompt
  if (!packs || packs.length === 0) {
    const response = await prompts({
      type: 'multiselect',
      name: 'packs',
      message: 'Select asset packs to install:',
      choices: Object.entries(AVAILABLE_ASSET_PACKS).map(([key, pack]) => ({
        title: `${pack.name} (${pack.size})`,
        value: key,
        description: pack.description
      })),
      hint: 'Space to select, Enter to confirm'
    });
    
    if (!response.packs || response.packs.length === 0) {
      logger.info('No asset packs selected.');
      return;
    }
    
    packs = response.packs;
  }
  
  // Handle special 'all' keyword
  if (packs.includes('all')) {
    packs = availablePacks;
  }
  
  // Validate packs
  const invalidPacks = packs.filter(p => !AVAILABLE_ASSET_PACKS[p]);
  if (invalidPacks.length > 0) {
    logger.error(`Unknown asset packs: ${invalidPacks.join(', ')}`);
    logger.info(`Available packs: ${availablePacks.join(', ')}`);
    return;
  }
  
  const spinner = logger.spinner('Installing asset packs...').start();
  
  try {
    const projectRoot = process.cwd();
    const targetPath = path.join(projectRoot, options.path || 'public/assets');
    const templatesDir = getTemplatesDir();
    
    // Ensure target directory exists
    await fs.ensureDir(targetPath);
    
    let installedCount = 0;
    let skippedCount = 0;
    let totalFiles = 0;
    
    // Copy each asset pack
    for (const packName of packs) {
      const pack = AVAILABLE_ASSET_PACKS[packName];
      if (!pack) continue;
      
      spinner.text = `Installing ${pack.name}...`;
      
      const sourcePath = path.join(templatesDir, pack.path);
      const destPath = path.join(targetPath, pack.path.replace('assets/', ''));
      
      if (!await fs.pathExists(sourcePath)) {
        logger.warn(`Asset pack not found: ${packName}`);
        skippedCount++;
        continue;
      }
      
      // Check if already exists
      if (await fs.pathExists(destPath) && !options.overwrite) {
        spinner.text = `Skipped ${pack.name} (already exists)`;
        skippedCount++;
        continue;
      }
      
      // Copy the asset pack
      await copyDirectory(sourcePath, destPath, options.overwrite);
      
      // Count files
      const files = await countFiles(destPath);
      totalFiles += files;
      
      installedCount++;
      spinner.text = `Installed ${pack.name}`;
    }
    
    // Copy manifest if any assets were installed
    if (installedCount > 0) {
      spinner.text = 'Copying asset manifest...';
      const manifestSource = path.join(templatesDir, 'assets/manifest.json');
      const manifestDest = path.join(targetPath, 'manifest.json');
      
      if (await fs.pathExists(manifestSource)) {
        await fs.copy(manifestSource, manifestDest, { overwrite: options.overwrite });
      }
      
      // Also copy audio manifest if audio pack was installed
      if (packs.includes('audio@v1')) {
        const audioManifestSource = path.join(templatesDir, 'assets/audio/v1/audio-manifest.json');
        const audioManifestDest = path.join(targetPath, 'audio/v1/audio-manifest.json');
        
        if (await fs.pathExists(audioManifestSource)) {
          await fs.copy(audioManifestSource, audioManifestDest, { overwrite: options.overwrite });
        }
      }
    }
    
    spinner.succeed(`Installed ${installedCount} asset pack(s) (${totalFiles} files)`);
    
    if (skippedCount > 0) {
      logger.info(`${skippedCount} pack(s) already existed and were skipped.`);
      logger.info(`Use --overwrite to replace existing packs.`);
    }
    
    if (installedCount > 0) {
      console.log('');
      logger.success('Assets installed successfully!');
      console.log('');
      logger.info('Assets are available at:');
      console.log(chalk.gray(`  ${options.path || 'public/assets'}/`));
      console.log('');
      logger.info('Use in your components:');
      console.log(chalk.gray(`  import { useAsset } from './remotion/ui/assets/useAsset';`));
      console.log(chalk.gray(`  const { url } = useAsset('icon-shield-v1', 'outline-24');`));
      
      // If we need to create the useAsset hook, notify the user
      const uiPath = path.join(projectRoot, 'src/remotion/ui');
      const useAssetPath = path.join(uiPath, 'assets/useAsset.tsx');
      
      if (!await fs.pathExists(useAssetPath)) {
        console.log('');
        logger.info('Note: You may need to create the useAsset hook.');
        logger.info('Run: npx remotion-ui add use-asset');
      }
    }
    
  } catch (error) {
    spinner.fail('Failed to install asset packs');
    logger.error(String(error));
    process.exit(1);
  }
};

async function countFiles(dir: string): Promise<number> {
  let count = 0;
  
  try {
    const items = await fs.readdir(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = await fs.stat(fullPath);
      
      if (stat.isDirectory()) {
        count += await countFiles(fullPath);
      } else {
        count++;
      }
    }
  } catch (error) {
    // Directory doesn't exist or can't be read
  }
  
  return count;
}