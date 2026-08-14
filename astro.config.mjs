import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Deployment target is injected via environment so the same source builds for
// both the local root (base `/`) and GitHub Pages (base `/youth/`).
//   SITE_BASE — Astro `base`, e.g. `/youth/`
//   SITE_URL  — absolute origin used for canonical URLs, e.g. https://numtip.github.io
const base = process.env.SITE_BASE ?? '/';
const site = process.env.SITE_URL || undefined;

export default defineConfig({
  site,
  base,
  output: 'static',
  i18n: {
    defaultLocale: 'th',
    locales: ['th', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
