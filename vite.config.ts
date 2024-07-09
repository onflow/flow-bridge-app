// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://api.axelar.network', 
        changeOrigin: true,
        rewrite: (path) => {
          const newPath = path.replace(/^\/api\/proxy/, '');
          const [base, query] = newPath.split('?url=');
          return `${base}${query}`;
        }
      },
    },
  },
});