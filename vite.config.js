import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // Agregamos esto para forzar una sola instancia de React
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
})