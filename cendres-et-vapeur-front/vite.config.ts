import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://89.168.38.93',
        changeOrigin: true,
        secure: false,
      },
      '/products': {
        target: 'http://89.168.38.93',
        changeOrigin: true,
        secure: false,
      },
      '/orders': {
        target: 'http://89.168.38.93',
        changeOrigin: true,
        secure: false,
      },
      '/categories': {
        target: 'http://89.168.38.93',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
