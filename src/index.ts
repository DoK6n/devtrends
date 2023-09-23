import cors from '@elysiajs/cors'
import { logger } from './middlewares'
import { articlesRoute } from './routes/articles.route'
import { Elysia } from 'elysia'
import swagger from '@elysiajs/swagger'

const _serve = { serve: { hostname: 'localhost' } }

const server = new Elysia(_serve)
  .get('/', () => 'healthy')
  .use(cors())
  .use(swagger())
  .use(logger())



server.onError(({ code, error: { message }, set, log }) => {
  log.error(`[${code}] - ${message}`)

  switch (code) {
    case 'NOT_FOUND':
      set.status = 404
      break
    case 'VALIDATION':
      set.status = 422
      break
    case 'INTERNAL_SERVER_ERROR':
      set.status = 500
      break
    case 'INVALID_COOKIE_SIGNATURE':
      set.status = 401
      break
    default:
      set.status = 400
      break
  }

  return {
    code,
    message,
  }
})

server.use(articlesRoute)

server.listen(8001, ({ hostname, port }) => {
  console.log(`🦊 Elysia is running at ${hostname}:${port}`)
})

server.onStop(({ app, log }) =>
  log.info(`🦊 Server ${app?.server?.hostname}:${app.server?.port} stopped`)
)

export type Server = typeof server
