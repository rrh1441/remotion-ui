import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import prompts from 'prompts';
import { logger } from '../utils/logger';
import { copyFile, getTemplatesDir } from '../utils/files';

export interface AddOptions {
  path: string;
  overwrite?: boolean;
}

interface ComponentConfig {
  name: string;
  dependencies: string[];
  files: string[];
}

interface Registry {
  [key: string]: ComponentConfig;
}

// Load registry from templates
async function loadRegistry(): Promise<Registry> {
  const templatesDir = getTemplatesDir();
  const registryPath = path.join(templatesDir, 'registry.json');
  
  if (!await fs.pathExists(registryPath)) {
    logger.warn('Registry not found. Run build to generate it.');
    return {};
  }
  
  return await fs.readJson(registryPath);
}

// Get all dependencies recursively
function getAllDependencies(
  componentName: string,
  registry: Registry,
  visited: Set<string> = new Set()
): string[] {
  if (visited.has(componentName)) {
    return [];
  }
  
  visited.add(componentName);
  
  const component = registry[componentName];
  if (!component) {
    return [];
  }
  
  const deps: string[] = [];
  
  for (const dep of component.dependencies || []) {
    deps.push(dep);
    deps.push(...getAllDependencies(dep, registry, visited));
  }
  
  return [...new Set(deps)]; // Remove duplicates
}

export const add = async (components: string[], options: AddOptions) => {
  const registry = await loadRegistry();
  const availableComponents = Object.keys(registry);
  
  if (!components || components.length === 0) {
    const response = await prompts({
      type: 'multiselect',
      name: 'components',
      message: 'Select components to add:',
      choices: availableComponents.map(comp => ({
        title: comp,
        value: comp,
        description: registry[comp].dependencies.length > 0 
          ? `Depends on: ${registry[comp].dependencies.join(', ')}`
          : undefined
      })),
    });
    
    if (!response.components || response.components.length === 0) {
      logger.info('No components selected.');
      return;
    }
    
    components = response.components;
  }
  
  // Validate components exist
  const invalidComponents = components.filter(c => !registry[c]);
  if (invalidComponents.length > 0) {
    logger.error(`Unknown components: ${invalidComponents.join(', ')}`);
    logger.info(`Available components: ${availableComponents.join(', ')}`);
    return;
  }
  
  // Resolve all dependencies
  const allComponents = new Set<string>();
  for (const comp of components) {
    allComponents.add(comp);
    const deps = getAllDependencies(comp, registry);
    deps.forEach(dep => allComponents.add(dep));
  }
  
  // Show what will be installed
  const dependencies = Array.from(allComponents).filter(c => !components.includes(c));
  if (dependencies.length > 0) {
    console.log('\n' + chalk.cyan('📦 The following dependencies will also be installed:'));
    console.log('  ' + dependencies.join(', '));
    
    const response = await prompts({
      type: 'confirm',
      name: 'confirm',
      message: 'Continue?',
      initial: true
    });
    
    if (!response.confirm) {
      logger.info('Installation cancelled.');
      return;
    }
  }
  
  const spinner = logger.spinner('Adding components...').start();
  
  try {
    const projectRoot = process.cwd();
    const targetPath = path.join(projectRoot, options.path);
    const templatesDir = getTemplatesDir();
    
    let addedCount = 0;
    let skippedCount = 0;
    
    // Install all components (including dependencies)
    for (const componentName of allComponents) {
      const component = registry[componentName];
      
      if (!component) {
        logger.warn(`Component not in registry: ${componentName}`);
        continue;
      }
      
      // Copy all files for this component
      for (const file of component.files) {
        const source = path.join(templatesDir, file);
        const dest = path.join(targetPath, file);
        
        if (!await fs.pathExists(source)) {
          logger.warn(`Source file not found: ${file}`);
          continue;
        }
        
        const copied = await copyFile(source, dest, options.overwrite);
        
        if (copied) {
          addedCount++;
          spinner.text = `Added ${componentName} (${file})`;
        } else {
          skippedCount++;
          spinner.text = `Skipped ${componentName} (already exists)`;
        }
      }
    }
    
    spinner.succeed(`Added ${addedCount} file(s)`);
    
    if (skippedCount > 0) {
      logger.info(`${skippedCount} file(s) already existed and were skipped.`);
      logger.info(`Use --overwrite to replace existing files.`);
    }
    
    console.log('');
    logger.success('Components added successfully!');
    console.log('');
    logger.info('Import components from:');
    
    // Show import paths for requested components only
    components.forEach(comp => {
      const component = registry[comp];
      if (component && component.files[0]) {
        const importPath = path.join(options.path, component.files[0]).replace(/\.tsx?$/, '');
        const componentName = comp.split('-').map(part => 
          part.charAt(0).toUpperCase() + part.slice(1)
        ).join('');
        console.log(chalk.gray(`  import { ${componentName} } from '${importPath}';`));
      }
    });
    
    if (dependencies.length > 0) {
      console.log('');
      logger.info('Dependencies were also installed:');
      console.log(chalk.gray('  ' + dependencies.join(', ')));
    }
    
  } catch (error) {
    spinner.fail('Failed to add components');
    logger.error(String(error));
    process.exit(1);
  }
};