import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// ASTRO_SITE / ASTRO_BASE are provided by the Pages workflow; locally they default to "/".
export default defineConfig({
  site: process.env.ASTRO_SITE || 'https://sinannar.github.io',
  base: process.env.ASTRO_BASE || '/',
  trailingSlash: 'always',
  output: 'static',
  integrations: [react()],
});
