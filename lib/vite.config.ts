import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import typescript from '@rollup/plugin-typescript';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      fileName: (format) => `verna.${format}.js`,
      name: 'index',
    },
    rollupOptions: {
      external: ['react'],
      output: {
        globals: {
          react: 'React',
        },
      },
      plugins: [
        typescript({
          allowSyntheticDefaultImports: true,
          declaration: true,
          declarationDir: resolve(__dirname, './dist/types'),
          exclude: resolve(__dirname, './node_modules/**'),
          noEmitOnError: true,
          rootDir: resolve(__dirname, './src'),
          target: 'ESNext',
        }),
      ],
    },
  },
  plugins: [react()],
});
