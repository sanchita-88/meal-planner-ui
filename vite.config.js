import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['react-tsparticles', 'tsparticles'] // <-- This line forces Vite to pre-bundle the modules
  }
});