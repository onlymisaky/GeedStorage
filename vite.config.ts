import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
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
