import { PrismaClient } from '@prisma/client'
import { createPrismaQueryEventHandler } from 'prisma-query-log'
import { createPinoLogger } from 'src/common/plugins'

const log = createPinoLogger()

const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'stdout', level: 'info' },
    { emit: 'stdout', level: 'warn' },
    { emit: 'stdout', level: 'error' },
  ],
  errorFormat: 'minimal',
})

const queryLogger = createPrismaQueryEventHandler({
  logger: query => {
    log.debug(query)
  },
  queryDuration: true,
  format: false,
  colorQuery: '\u001B[96m',
  colorParameter: '\u001B[90m',
})

prisma.$on('query', queryLogger)

export default prisma
