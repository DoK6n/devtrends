import Elysia from 'elysia'
import { date } from '../../utils'
import pino, { type Logger as PinoLogger, type LoggerOptions } from 'pino'

const loggerOptions: LoggerOptions = {
  redact: ['DB_CONN'],
  formatters: {
    level: label => {
      return { level: label }
    },
  },
  base: undefined,
  level: Bun.env.PORT === 'production' ? 'info' : 'debug',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      sync: true,
    },
  },
  timestamp: () =>
    `, "timestamp":"${date().tz().format('YYYY-MM-DD HH:mm:ss')}"`,
}

export const createPinoLogger = () => pino(loggerOptions)

export const loggerPlugin = () =>
  new Elysia({
    name: 'logger',
  }).derive(() => {
    const log = createPinoLogger()

    return { log }
  })

export type Logger = PinoLogger<typeof loggerOptions>
