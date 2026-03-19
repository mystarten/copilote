import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/n8n': {
        target: 'https://n8n.srv1104296.hstgr.cloud',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/n8n/, ''),
      },
    },
  },
})
