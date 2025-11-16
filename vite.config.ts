import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';

export default defineConfig(() => {
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      resolve: {
        alias: {
          // FIX: `__dirname` is not available in ES modules.
          // We can construct it from `import.meta.url`.
          '@': path.dirname(fileURLToPath(import.meta.url)),
        }
      }
    };
});