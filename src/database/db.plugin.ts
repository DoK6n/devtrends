import { PrismaClient } from '@prisma/client'
import Elysia from 'elysia'
import { createPrismaQueryEventHandler } from 'prisma-query-log'
import { logger } from 'src/common/plugins'

export const database = new Elysia({ name: 'database' })
  .use(logger())
  .decorate(
    'prisma',
    new PrismaClient({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
      errorFormat: 'minimal',
    }),
  )
  .derive(({ prisma, log }) => {
    prisma.$on(
      'query',
      createPrismaQueryEventHandler({
        logger: query => {
          log.debug(query)
        },
        format: false,
        queryDuration: true,
        colorQuery: '\u001B[96m',
        colorParameter: '\u001B[90m',
      }),
    )
    return {}
  })
