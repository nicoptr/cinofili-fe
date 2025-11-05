import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    server: {
        host: true,       // very important
        port: 4000,
        strictPort: true,
        allowedHosts: []
    }

})
