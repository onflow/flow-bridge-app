import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api/proxy': {
        target: 'https://api-sepolia.basescan.org',
        changeOrigin: true,
        rewrite: (path) => {
          const url = new URL(path, 'http://dummy.com');
          const targetUrl = url.searchParams.get('url');
          if (!targetUrl) {
            console.error('No URL provided in the proxy request');
            return path;
          }
          const parsedUrl = new URL(targetUrl);
          console.log('Proxying to:', parsedUrl.pathname + parsedUrl.search);
          return parsedUrl.pathname + parsedUrl.search;
        },
      },
    },
  },
});