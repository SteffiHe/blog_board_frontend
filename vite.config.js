import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: { 
    port: 9999,
    host: '0.0.0.0', // allows connections from any network, including Docker
    allowedHosts: [
      'host.docker.internal', // Allow this host for Docker
      'localhost',             // You can also add localhost if needed
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Or any backend URL you need to proxy
        changeOrigin: true,
        secure: false,
      },
    },
  }
})
