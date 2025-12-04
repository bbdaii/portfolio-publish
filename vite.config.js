import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import glsl from 'vite-plugin-glsl';

// https://vite.dev/config/
export default defineConfig({
  base: '/portfolio-publish/',
  plugins: [
    react(),
    tailwindcss(),
    glsl(),
  ],
  server: {
    host: true
  },
  preview: {
    host: true,
    allowedHosts: ["luckily-classic-dove.ngrok-free.app"]
  },
  build: {
    emptyOutDir: true, 
    outDir: 'dist', // GitLab Pages 預設使用 'public' 目錄
    assetsDir: 'assets',
  },
})
