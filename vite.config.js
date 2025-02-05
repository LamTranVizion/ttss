import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  base: '/TTS',
  plugins: [react()],
  build: {
    rollupOptions:{
      external: ['@gradio/client'],
    },
    outDir: 'dist',
  }
})
