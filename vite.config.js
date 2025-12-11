import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // ⬇️ ADD THIS BLOCK TO FIX THE PRODUCTION BUILD CRASH ⬇️
  build: {
    rollupOptions: {
      external: ['jspdf', 'html2canvas'],
    },
  },
  // ⬆️ END OF FIX ⬆️
})