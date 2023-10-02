import Elysia from 'elysia'
import prisma from './prisma-client'

export const database = new Elysia({ name: 'database' }).decorate(
  'prisma',
  prisma,
)
