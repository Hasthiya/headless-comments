import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'index.ts',
    core: 'core/index.ts',
    headless: 'headless/index.ts',
    'presets/default': 'presets/default/index.ts',
    'presets/styled': 'presets/styled/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false,
  external: ['react', 'react-dom'],
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";',
    };
  },
});
