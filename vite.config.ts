import { defineConfig } from 'vite'

import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vitejs.dev/config/
export default defineConfig({
  root: './src/ui',
  plugins: [react(), viteSingleFile()],
  build: {
    target: 'ES6',
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    cssCodeSplit: false,
    outDir: '../../dist',
    rollupOptions: {
      output: {
        inlineDynamicImports: true
      }
    }
  }
})
