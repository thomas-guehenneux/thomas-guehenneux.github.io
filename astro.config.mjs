import { defineConfig } from 'astro/config'
import solidJs from '@astrojs/solid-js'
import tailwind from '@astrojs/tailwind'
import sitemap from '@astrojs/sitemap'
// import subfont from '@ernxst/subfont/astro'

import vercelStatic from '@astrojs/vercel/static'

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
  output: 'static',
  adapter: vercelStatic(),
})
