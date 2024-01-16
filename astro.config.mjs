import { defineConfig } from 'astro/config'
import solidJs from '@astrojs/solid-js'
import tailwind from '@astrojs/tailwind'
import sitemap from '@astrojs/sitemap'
import vercel from '@astrojs/vercel/serverless'

export const prerender = false

// https://astro.build/config
export default defineConfig({
  site: 'http://localhost:4321',
  integrations: [
    solidJs(),
    tailwind({
      applyBaseStyles: false,
    }),
    // subfont(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          ja: 'ja',
        },
      },
    }),
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ja'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
  output: 'hybrid',
  adapter: vercel(),
})
