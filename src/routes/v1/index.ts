import { articlesRoute } from './articles'
import Elysia from 'elysia'

export const v1Routes = new Elysia({ name: 'v1Routes', prefix: '/v1' }).use(
  articlesRoute,
)
