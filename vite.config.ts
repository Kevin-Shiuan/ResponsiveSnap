import path from 'path'
import { defineConfig } from 'vite'

import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  root: './src/ui',
  plugins: [react(), viteSingleFile()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/ui')
    }
  },
  build: {
    target: 'es2015',
    outDir: '../../dist'
  }
})
