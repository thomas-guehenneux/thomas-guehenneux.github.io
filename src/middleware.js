import { redirectToDefaultLocale } from 'astro:i18n' // function available with `manual` routing
import { defineMiddleware } from 'astro:middleware'
export const onRequest = defineMiddleware(async (ctx, next) => {
  if (ctx.url.pathname === '') {
    return redirectToDefaultLocale(302)
  }
  return next()
})
