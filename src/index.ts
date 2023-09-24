import cors from '@elysiajs/cors'
import { createPinoLogger, httpExceptionFilter, logger } from './common/plugins'
import { articlesRoute } from './routes/articles.route'
import { Elysia } from 'elysia'
import swagger from '@elysiajs/swagger'

const _serve = { serve: { hostname: 'localhost' } }

const server = new Elysia(_serve)
  .get('/', () => 'healthy')
  .use(cors())
  .use(swagger())
  .use(logger())
  .use(httpExceptionFilter())

server.use(articlesRoute)

const PORT = 8001

server.listen(PORT, ({ hostname, port }) => {
  createPinoLogger().info(`🦊 Elysia is running at ${hostname}:${port}`)
})

server.onStop(({ app, log }) =>
  log.info(`🦊 Server ${app?.server?.hostname}:${app.server?.port} stopped`),
)

export type Server = typeof server
