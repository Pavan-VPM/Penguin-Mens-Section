import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Enable SPA fallback so React Router handles all routes
    // (fixes "page not found" when navigating directly to /collection/shirts, etc.)
    historyApiFallback: true,
    port: 5173,
  },
})
