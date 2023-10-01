import Elysia from 'elysia'
import { logger } from '../loggers'
import { isEmptyObject } from 'src/common/utils'

export const loggingInterceptor = () =>
  new Elysia({ name: 'logging-interceptor' })
    .use(logger())
    .onBeforeHandle(({ request, params, query, body, log }) => {
      const logObject = {
        params,
        body,
        ...(isEmptyObject(query) ? {} : { query }),
      }

      log.info(logObject, `request | [${request.method}] - ${request.url}`)
    })
    .onAfterHandle(({ request, log, response }) => {
      const logObject = {
        response,
      }

      log.info(logObject, `response | [${request.method}] - ${request.url}`)
    })
