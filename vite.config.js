import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    host: true,
    port: 5173, // or any other port
    proxy: {
      // Proxy API requests to your backend
      '/api': {
        target: 'http://127.0.0.1:3000', 
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
  // base: 'https://check.zetdigi.com/',
  // base: 'https://zetdigitesting.online/',
  // base: 'https://audiomixingmastering.com/',
  base: '/',
  plugins: [react()],
  optimizeDeps: {
    include: ['react-redux', "react-topbar-progress-indicator"],
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: '/src',
      },
    ]
  },
});
