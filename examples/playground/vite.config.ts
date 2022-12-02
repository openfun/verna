import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  // Defined to match the path to access to this demo on github pages.
  // (https://openfun.github.io/verna/playground/)
  base: '/verna/playground/',
  optimizeDeps: {
    exclude: ['@openfun/verna'],
  },
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: ':',
        replacement: resolve(__dirname, './src'),
      },
    ],
  },
});
