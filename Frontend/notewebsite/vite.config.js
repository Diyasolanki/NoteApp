import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // root: 'Frontend/notewebsite/src',
  // base: './',
  // build: {
  //   // Adjust the relative path based on your project structure
  //   outDir: '../../../dist'
  // },
  plugins: [react()],
})
