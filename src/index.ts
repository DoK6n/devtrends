import cors from '@elysiajs/cors'
import {
  createPinoLogger,
  httpExceptionFilter,
  loggingInterceptor,
} from './common/plugins'
import { Elysia } from 'elysia'
import swagger from '@elysiajs/swagger'
import { setup } from './config'
import { v1Routes } from './routes'

const _serve = { serve: { hostname: 'localhost' } }

export const app = new Elysia(_serve)
  .get('/', () => 'healthy')
  .use(setup())
  .use(cors())
  .use(swagger())
  .use(loggingInterceptor())
  .use(httpExceptionFilter())
  .use(v1Routes)

// eslint-disable-next-line no-magic-numbers
const PORT = Bun.env.PORT || 8001

app.listen(PORT, ({ hostname, port }) => {
  createPinoLogger().info(`🦊 Elysia is running at ${hostname}:${port}`)
})

app.onStop(({ app, log }) =>
  log.info(`🦊 Server ${app?.server?.hostname}:${app.server?.port} stopped`),
)

export type App = typeof app
