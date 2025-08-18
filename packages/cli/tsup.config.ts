import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  shims: true,
  clean: true,
  minify: false,
  sourcemap: true,
  // Ensure the CLI is executable
  banner: {
    js: '#!/usr/bin/env node',
  },
});