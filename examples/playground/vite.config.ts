import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
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
