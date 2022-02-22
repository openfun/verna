import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import typescript from '@rollup/plugin-typescript';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'index',
      fileName: (format) => `verna.${format}.js`,
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
          target: 'ESNext',
          rootDir: resolve(__dirname, './src'),
          declaration: true,
          declarationDir: resolve(__dirname, './dist/types'),
          exclude: resolve(__dirname, './node_modules/**'),
          allowSyntheticDefaultImports: true,
          noEmitOnError: true,
        }),
      ],
    },
  },
});
