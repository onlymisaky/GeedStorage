import path from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
      outDir: 'dist/typings',
      tsconfigPath: './tsconfig.json',
    }),
  ],
  build: {
    outDir: 'dist',
    sourcemap: true,
    lib: {
      entry: path.resolve(import.meta.dirname, 'src/index.ts'),
      name: 'GeedStorage',
      formats: ['umd', 'es'],
      fileName(format) {
        if (format === 'es') {
          return 'geed-storage.js';
        }
        return `geed-storage.${format}.js`;
      },
    },
    rollupOptions: {
      output: {
        exports: 'default',
      },
    },
  },
});
