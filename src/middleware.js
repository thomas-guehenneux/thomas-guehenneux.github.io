import { redirectToDefaultLocale } from 'astro:i18n'
import { defineMiddleware } from 'astro:middleware'
export const onRequest = defineMiddleware(async (ctx, next) => {
  if (
    ctx.url.pathname.startsWith('/keystatic') ||
    ctx.url.pathname.startsWith('/en') ||
    ctx.url.pathname.startsWith('/_image')
  ) {
    return next()
  }
  return redirectToDefaultLocale(ctx)
})
