import Elysia from 'elysia'
import { database } from '../database/db.plugin'
import { logger } from 'src/common/plugins'

export const setup = () => (app: Elysia) => app.use(logger()).use(database)
