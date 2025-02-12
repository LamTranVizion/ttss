import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/ttss/',
  build: {
    rollupOptions:{
      external: ['https://cdn.jsdelivr.net/npm/@gradio/client/+esm'],
    },
  }
})
