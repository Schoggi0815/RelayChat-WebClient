import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: './build',
    chunkSizeWarningLimit: 2000,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8181',
        changeOrigin: true,
      },
      '/swagger': {
        target: 'http://localhost:8181',
        changeOrigin: true,
      },
      '/signalr': {
        target: 'http://localhost:8181',
        changeOrigin: true,
        ws: true,
      },
    },
  },
  plugins: [react()],
})
