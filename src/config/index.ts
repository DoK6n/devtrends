import Elysia from 'elysia'
import { database } from '../database/db.plugin'

export const setup = new Elysia({ name: 'setup' }).use(database)
