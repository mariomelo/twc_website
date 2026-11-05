import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    fs: {
      // src/lib/data/idea-garden.js imports the conference boards straight
      // from static/ so they stay the single source of truth.
      allow: ['static']
    }
  }
});
