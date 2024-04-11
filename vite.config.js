import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  envPrefix: "VUE_APP",
  clearScreen: true,
  server: {
    host: '0.0.0.0',
    port: 8080,
    strictPort: true,
  }

})