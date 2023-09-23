import Elysia from 'elysia'
import { date, isEmptyObject } from '../common/utils'
import pino, { type Logger as PinoLogger, type LoggerOptions } from 'pino'

const loggerOptions: LoggerOptions = {
  redact: ['DB_CONN'],
  formatters: {
    level(label) {
      return { level: label }
    },
  },
  base: undefined,
  level: 'info',
  // transport: {
  //   target: 'pino-pretty',
  //   options: {
  //     colorize: true,
  //   },
  // },
  timestamp: () =>
    `, "timestamp":"${date().tz().format('YYYY-MM-DD HH:mm:ss')}"`,
}

export const createPinoLogger = () => pino(loggerOptions)

export const logger = () =>
  new Elysia({
    name: 'logger',
  })
    .derive(ctx => {
      const log = createPinoLogger()

      return { log }
    })
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

export type Logger = PinoLogger<typeof loggerOptions>
