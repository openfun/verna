import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, './src/index.ts'),
      fileName: () => 'index.js',
      formats: ['es'],
      name: 'index',
    },
    minify: true,
    rollupOptions: {
      external: ['react', 'react-dom', 'react-intl'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react-intl': 'ReactIntl',
        },
      },
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
