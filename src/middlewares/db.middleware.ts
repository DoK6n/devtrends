import Elysia from 'elysia'
import { ArticlesRepository } from '../repositories/articles.repository'
import { createPinoLogger, logger } from './logger.middleware'

export const database = new Elysia({ name: 'db' })
  .use(logger())
  .decorate('db', new ArticlesRepository(createPinoLogger()))
