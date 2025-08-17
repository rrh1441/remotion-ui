import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

export const getTemplatesDir = () => {
  const __filename = fileURLToPath(import.meta.url || '');
  const __dirname = path.dirname(__filename);
  return path.resolve(__dirname, '../../../templates');
};

export const copyFile = async (
  source: string,
  destination: string,
  overwrite = false
) => {
  if (!overwrite && await fs.pathExists(destination)) {
    return false;
  }
  
  await fs.ensureDir(path.dirname(destination));
  await fs.copyFile(source, destination);
  return true;
};

export const copyDirectory = async (
  source: string,
  destination: string,
  overwrite = false
) => {
  await fs.ensureDir(destination);
  
  const items = await fs.readdir(source);
  
  for (const item of items) {
    const sourcePath = path.join(source, item);
    const destPath = path.join(destination, item);
    const stat = await fs.stat(sourcePath);
    
    if (stat.isDirectory()) {
      await copyDirectory(sourcePath, destPath, overwrite);
    } else {
      await copyFile(sourcePath, destPath, overwrite);
    }
  }
};

export const readPackageJson = async (projectPath: string) => {
  const packageJsonPath = path.join(projectPath, 'package.json');
  
  if (!await fs.pathExists(packageJsonPath)) {
    return null;
  }
  
  return await fs.readJson(packageJsonPath);
};