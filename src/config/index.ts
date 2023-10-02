import Elysia from 'elysia'
import { database } from '../database/database.plugin'

export const setup = new Elysia({ name: 'setup' }).use(database)
