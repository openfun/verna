import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/verna/poll/',
  optimizeDeps: {
    exclude: ['@openfun/verna'],
  },
  plugins: [react()],
  resolve: {
    alias: {
      ':': resolve(__dirname, './src'),
    },
  },
});
