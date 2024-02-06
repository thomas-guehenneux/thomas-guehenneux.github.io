import { defineMiddleware } from 'astro/middleware'

export const onRequest = defineMiddleware((context, next) => {
  // if url is /_image, skip the middleware (avoid to break dev server image rendering)
  if (context.url.pathname === '/_image') {
    return next()
  }

  // if the request url has no trailing slash, redirect to the same path with a trailing slash
  if (!context.url.pathname.endsWith('/')) {
    return Response.redirect(new URL(`${context.url}/`, context.url), 301)
  }

  return next()
})
