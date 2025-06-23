import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  output: 'static',
  base: '/',
  site: 'https://itsjustivan.com', // Use your custom domain for production
  // If deploying to a subpath (e.g., github.io without a custom domain), set base: '/ItsJustIvan.github.io/',
  trailingSlash: 'always',
  integrations: [mdx(), sitemap(), tailwind()]
});