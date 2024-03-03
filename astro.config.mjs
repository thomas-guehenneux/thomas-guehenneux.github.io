import markdoc from '@astrojs/markdoc'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import solidJs from '@astrojs/solid-js'
import tailwind from '@astrojs/tailwind'
import keystatic from '@keystatic/astro'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  site: 'http://localhost:4321/',
  integrations: [
    react({
      include: ['keystatic.config.tsx'],
    }),
    solidJs({
      exclude: ['keystatic.config.tsx'],
    }),
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          ja: 'ja',
        },
      },
    }),
    markdoc(),
    process.env.NODE_ENV === 'production' ? null : keystatic(),
  ],
  // i18n: {
  //   defaultLocale: 'en',
  //   locales: ['en', 'ja'],
  //   routing: {
  //     prefixDefaultLocale: true,
  //     redirectToDefaultLocale: true,
  //   },
  // },
  output: process.env.NODE_ENV === 'production' ? 'static' : 'hybrid',
  vite: {
    ssr: {
      noExternal: ['react-tweet'],
    },
  },
})
