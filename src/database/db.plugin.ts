import Elysia from 'elysia'
import { ArticlesRepository } from '../repositories/articles.repository'
import { createPinoLogger, logger } from '../common/plugins/loggers/logger.plugin'

export const database = new Elysia({ name: 'db' })
  .use(logger())
  .decorate('db', new ArticlesRepository(createPinoLogger()))
