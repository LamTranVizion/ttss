import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/ttss/',
  build: {
    rollupOptions:{
      external: ['@gradio/client'],
    },
    outDir: 'dist',
  }
})
