import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import solidJs from '@astrojs/solid-js'
import tailwind from '@astrojs/tailwind'
import { defineConfig } from 'astro/config'
import remarkCaptions from 'remark-captions'

// https://astro.build/config
export default defineConfig({
  site: 'https://thomas-guehenneux.github.io',
  base: '/new_blog_ml',
  // trailingSlash: 'always',
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
  // experimental: {
  //   contentCollectionCache: true,
  // },
})
