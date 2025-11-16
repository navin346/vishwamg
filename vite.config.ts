import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  resolve: {
    alias: {
      // FIX: `__dirname` is not available in ES modules. Using `import.meta.url` to get the directory of the current file.
      '@': fileURLToPath(new URL('.', import.meta.url)),
    },
  },
});
