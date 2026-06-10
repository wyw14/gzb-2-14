import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5514,
    proxy: {
      '/api': {
        target: 'http://localhost:4114',
        changeOrigin: true
      }
    }
  }
})
