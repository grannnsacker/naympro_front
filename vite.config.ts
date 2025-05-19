import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 41091,
    host: '0.0.0.0',
    allowedHosts: ['root-hub.ru', 'root-hub.ru:41092', 'root-hub.ru:41111'],
    proxy: {
      '/api': {
        target: 'http://root-hub.ru:41092',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api/v1')
      }
    }
  },
});