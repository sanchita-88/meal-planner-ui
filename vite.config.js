import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // ⬇️ ADD THIS BLOCK TO RESOLVE THE VERCEL BUILD CRASH ⬇️
  optimizeDeps: {
    exclude: ['jspdf', 'html2canvas'],
  },
  // ⬆️ END OF FIX ⬆️
})