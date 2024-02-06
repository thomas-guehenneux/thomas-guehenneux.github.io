import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import solidJs from '@astrojs/solid-js'
import tailwind from '@astrojs/tailwind'
import vercel from '@astrojs/vercel/static'
import { defineConfig } from 'astro/config'
import remarkCaptions from 'remark-captions'

// https://astro.build/config
export default defineConfig({
  site: 'http://localhost:4321',
  integrations: [
    solidJs(),
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
    mdx(),
  ],
  markdown: {
    remarkPlugins: [remarkCaptions],
    extendDefaultPlugins: true,
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ja'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
  prefetch: {
    prefetchAll: true,
  },
  output: 'static',
  adapter: vercel(),
  // experimental: {
  //   contentCollectionCache: true,
  // },
})
