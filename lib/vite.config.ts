import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import typescript from '@rollup/plugin-typescript';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  build: {
    lib: {
      entry: resolve(__dirname, './src/index.ts'),
      fileName: () => 'index.js',
      formats: ['es'],
      name: 'index',
    },
    minify: mode !== 'development',
    rollupOptions: {
      external: ['react', 'react-dom', 'react-intl'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react-intl': 'ReactIntl',
        },
      },
      plugins: [
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
          noEmitOnError: mode !== 'development',
          rootDir: resolve(__dirname, './src'),
          target: 'ESNext',
        }),
      ],
    },
  },
  plugins: [react()],
}));
