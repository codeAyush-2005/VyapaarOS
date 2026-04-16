import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Disable minification for rolldown-vite compatibility
    // In production with standard vite, you would use minify: 'esbuild' or 'terser'
    minify: false,
    // Enable source maps for production debugging (optional)
    sourcemap: false,
    // Optimize CSS
    cssCodeSplit: true,
    // Set target for modern browsers
    target: 'es2015',
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'lucide-react', 'date-fns'],
  },
})
