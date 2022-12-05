import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: {
        index: resolve(__dirname, './src/index.ts'),
        tests: resolve(__dirname, './src/tests/index.ts'),
      },
      formats: ['es'],
    },
    minify: false,
    rollupOptions: {
      external: ['react', 'react-dom', 'react-intl'],
      treeshake: false,
    },
    sourcemap: true,
    // TODO: use server.watch
    watch: {
      exclude: [resolve(__dirname, './src/tests'), resolve(__dirname, './src/**/*.spec.tsx?')],
      include: [resolve(__dirname, './src/**')],
    },
  },
  plugins: [dts(), react()],
  resolve: {
    alias: [
      {
        find: ':',
        replacement: resolve(__dirname, './src'),
      },
    ],
  },
});
