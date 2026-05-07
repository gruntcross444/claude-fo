import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// `base: './'` emits relative asset URLs in dist/index.html so the build also
// renders when served from a subdirectory (preview hosts, S3 sub-paths, etc.).
// Domain-rooted deploys (claudefo.com) keep working unchanged.
export default defineConfig({
  base: './',
  plugins: [react()],
})
