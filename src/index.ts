import cors from '@elysiajs/cors'
import {
  createPinoLogger,
  httpExceptionFilterPlugin,
  loggingInterceptorPlugin,
} from './common/plugins'
import { Elysia } from 'elysia'
import swagger from '@elysiajs/swagger'
import { setup } from './config'
import { v1Routes } from './routes'

const _serve = { serve: { hostname: 'localhost' } }

export const app = new Elysia(_serve)
  .get('/', () => 'healthy')
  .use(setup)
  .use(cors())
  .use(
    swagger({
      path: '/v1/api-docs',
      documentation: {
        info: {
          title: 'Devtrends Documentation',
          version: '0.0.1',
        },
        tags: [{ name: 'Articles', description: 'Articles endpoints' }],
      },
    }),
  )
  .use(loggingInterceptorPlugin())
  .use(httpExceptionFilterPlugin())
  .use(v1Routes)

const PORT = Bun.env.PORT || 8001

app.listen(PORT, ({ hostname, port }) => {
  const log = createPinoLogger()
  log.info(
    `
          🦊 Server ready at: ${hostname}:${port}
          📗 URL for OpenAPI: http://${hostname}:${PORT}/v1/api-docs
          🌐 URL for HOST : http://${hostname}
    `,
  )
})

app.onStop(({ app, log }) =>
  log.info(`🦊 Server ${app.server?.hostname}:${app.server?.port} stopped`),
)

export type App = typeof app
