import { defineConfig } from 'vite';

// Base path: "/" for Vercel, "/peece/" for GitHub Pages (set by `npm run build:pages`).
export default defineConfig({
  build: {
    target: 'es2020',
    cssCodeSplit: false,
    assetsInlineLimit: 0,
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.js'],
  },
});
