import cors from '@elysiajs/cors'
import {
  createPinoLogger,
  httpExceptionFilter,
  logger,
  loggingInterceptor,
} from './common/plugins'
import { articlesRoute } from './routes/articles.route'
import { Elysia } from 'elysia'
import swagger from '@elysiajs/swagger'
import { setup } from './config'

const _serve = { serve: { hostname: 'localhost' } }

export const app = new Elysia(_serve)
  .get('/', () => 'healthy')
  .use(setup())
  .use(cors())
  .use(swagger())
  .use(logger())
  .use(loggingInterceptor())
  .use(httpExceptionFilter())
  .use(articlesRoute())

// eslint-disable-next-line no-magic-numbers
const PORT = Bun.env.PORT || 8001

app.listen(PORT, ({ hostname, port }) => {
  createPinoLogger().info(`🦊 Elysia is running at ${hostname}:${port}`)
})

app.onStop(({ app, log }) =>
  log.info(`🦊 Server ${app?.server?.hostname}:${app.server?.port} stopped`),
)

export type App = typeof app
