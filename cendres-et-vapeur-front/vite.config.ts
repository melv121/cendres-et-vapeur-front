import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const DEV_ORIGIN = 'http://localhost:5173';
const TARGET = 'http://89.168.38.93';

function proxyConfig(target = TARGET) {
  return {
    target,
    changeOrigin: true,
    secure: false,
    configure: (proxy: any) => {
      proxy.on && proxy.on('proxyRes', (proxyRes: any) => {
        try {
          proxyRes.headers = proxyRes.headers || {};
          proxyRes.headers['access-control-allow-origin'] = DEV_ORIGIN;
          proxyRes.headers['access-control-allow-credentials'] = 'true';
          if (proxyRes.headers['location']) {
            proxyRes.headers['location'] = String(proxyRes.headers['location']).replace(target, DEV_ORIGIN);
          }
        } catch (e) {}
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/colony-events/toxicity/status': proxyConfig(),
      '/api': proxyConfig(),
      '/products': proxyConfig(),
      '/product': proxyConfig(),
      '/logs': proxyConfig(),
      '/stats': proxyConfig(),
      '/admin/stats': proxyConfig(),
      '/shift-notes': proxyConfig(),
      '/orders': proxyConfig(),
      '/users': proxyConfig(),
      '/categories': proxyConfig(),
      '/chat': {
        target: 'ws://89.168.38.93',
        ws: true,
        changeOrigin: true,
      },
    },
  },
})
