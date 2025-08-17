import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'],
  shims: true,
  clean: true,
  minify: false,
  sourcemap: true,
});