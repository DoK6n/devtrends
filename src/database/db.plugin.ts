import Elysia from 'elysia'
import { ArticlesRepository } from '../repositories/articles.repository'
import { createPinoLogger } from '../common/plugins/loggers/logger.plugin'

export const database = new Elysia({ name: 'db' }).decorate(
  'db',
  new ArticlesRepository(createPinoLogger()),
)
