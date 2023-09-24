import Elysia from 'elysia'
import { HTTP_STATUS } from '../../constants'
import { logger } from 'src/common/plugins'

export const httpExceptionFilter = () => (app: Elysia) =>
  app.use(logger()).onError(({ code, error: { message }, set, log }) => {
    log.error(`[${code}] - ${message}`)

    switch (code) {
      case 'NOT_FOUND':
        set.status = HTTP_STATUS.NOT_FOUND
        break
      case 'VALIDATION':
        set.status = HTTP_STATUS.VALIDATION_ERROR
        break
      case 'INTERNAL_SERVER_ERROR':
        set.status = HTTP_STATUS.INTERNAL_SERVER_ERROR
        break
      case 'INVALID_COOKIE_SIGNATURE':
        set.status = HTTP_STATUS.UNAUTHORIZED
        break
      default:
        set.status = HTTP_STATUS.BAD_REQUEST
        break
    }

    return {
      code,
      message,
    }
  })
