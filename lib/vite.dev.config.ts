import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import typescript from '@rollup/plugin-typescript';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, './src/index.ts'),
      fileName: () => 'index.js',
      formats: ['es'],
      name: 'index',
    },
    minify: false,
    rollupOptions: {
      external: ['react', 'react-dom', 'react-intl'],
      treeshake: false,
    },
    sourcemap: true,
    watch: {
      exclude: [resolve(__dirname, './src/tests'), resolve(__dirname, './src/**/*.spec.tsx?')],
      include: [resolve(__dirname, './src/**')],
    },
  },
  plugins: [
    react(),
    typescript({
      declaration: true,
      declarationDir: resolve(__dirname, './dist'),
      exclude: [
        resolve(__dirname, './dist'),
        resolve(__dirname, './node_modules/**'),
        // Ignore all test stuff
        resolve(__dirname, './src/tests'),
        resolve(__dirname, './src/**/*.spec.tsx?'),
      ],
      noEmitOnError: false,
      rootDir: resolve(__dirname, './src'),
      target: 'ESNext',
    }),
  ],
  resolve: {
    alias: {
      ':': resolve(__dirname, './src'),
    },
  },
});
