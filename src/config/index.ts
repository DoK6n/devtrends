import Elysia from 'elysia'
import { database } from '../middlewares/db.middleware'

export const setup = new Elysia({ name: 'setup' }).use(database)
