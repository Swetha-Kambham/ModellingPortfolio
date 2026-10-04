import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import adminPlugin from './scripts/admin-plugin.mjs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), adminPlugin()],
})
