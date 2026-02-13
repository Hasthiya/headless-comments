import { defineConfig } from 'tsup';

/**
 * React entry points that need 'use client' injected.
 * Core and adapters/supabase are framework-agnostic and must NOT have the directive.
 */
const clientFiles = [
  'dist/index.js',
  'dist/index.mjs',
  'dist/headless.js',
  'dist/headless.mjs',
  'dist/presets/default.js',
  'dist/presets/default.mjs',
  'dist/presets/styled.js',
  'dist/presets/styled.mjs',
];

/**
 * Inject "use client" at the top of React entry-point files.
 * This runs AFTER the build so it survives Rollup's directive stripping.
 *
 * Uses dynamic require to avoid needing @types/node in the package tsconfig.
 */
async function injectUseClient() {
  // @ts-expect-error -- Node.js built-in; @types/node not in this package's tsconfig
  const fs = await import('fs');
  for (const file of clientFiles) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      if (!content.startsWith('"use client"')) {
        fs.writeFileSync(file, `"use client";\n${content}`);
      }
    }
  }
}

export default defineConfig({
  entry: {
    index: 'index.ts',
    core: 'core/index.ts',
    headless: 'headless/index.ts',
    'presets/default': 'presets/default/index.ts',
    'presets/styled': 'presets/styled/index.ts',
    'adapters/supabase': 'core/adapters/supabase.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false,
  external: ['react', 'react-dom', '@supabase/supabase-js'],
  async onSuccess() {
    await injectUseClient();
  },
});
