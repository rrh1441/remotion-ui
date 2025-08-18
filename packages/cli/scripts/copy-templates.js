#!/usr/bin/env node

import { copySync } from 'fs-extra/esm';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const source = join(__dirname, '../../../templates');
const destination = join(__dirname, '../templates');

console.log('Copying templates...');
console.log(`From: ${source}`);
console.log(`To: ${destination}`);

try {
  copySync(source, destination, {
    overwrite: true,
    filter: (src) => {
      // Skip node_modules and other unwanted files
      return !src.includes('node_modules') && 
             !src.includes('.git') && 
             !src.includes('.DS_Store');
    }
  });
  console.log('✅ Templates copied successfully!');
} catch (error) {
  console.error('❌ Failed to copy templates:', error);
  process.exit(1);
}