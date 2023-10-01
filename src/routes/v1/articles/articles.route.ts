import { ArticlesController } from './articles.controller'
import Elysia from 'elysia'

export const articlesRoute = new Elysia({
  name: 'articlesRoute',
  prefix: '/articles',
})
  .use(ArticlesController.retrieveArticles)
  .use(ArticlesController.addArticles)
  .use(ArticlesController.retrieveArticleById)
  .use(ArticlesController.updateArticleById)
  .use(ArticlesController.removeArticleById)
