import { build } from 'esbuild';
import { mkdir } from 'node:fs/promises';

await mkdir('dist', { recursive: true });

await build({
  entryPoints: ['src/server.mjs'],
  outfile: 'dist/server.mjs',
  bundle: true,
  platform: 'node',
  target: 'node24',
  format: 'esm',
  sourcemap: false,
  minify: false,
  legalComments: 'none'
});

console.log('Built dist/server.mjs');
