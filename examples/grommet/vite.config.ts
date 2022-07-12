import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        // We want to benefit of hmr when we are developing on @openfun/verna
        // workspace. A little hack to achieve this it to use an alias to resolve
        // the module through src instead of dist.
        find: /^@openfun\/verna$/,
        replacement: '@openfun/verna/src/index.ts',
      },
    ],
  },
});
