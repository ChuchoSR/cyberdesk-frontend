import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    
  ],
  // Regla de seguridad
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
})