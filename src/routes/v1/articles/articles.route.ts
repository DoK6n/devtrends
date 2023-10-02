import { ArticlesController } from './articles.controller'
import Elysia from 'elysia'

export const articlesRoute = new Elysia({
  name: 'articlesRoute',
}).group(
  '/articles',
  {
    detail: {
      tags: ['Articles'],
    },
  },
  app =>
    app
      .use(ArticlesController.retrieveArticles)
      .use(ArticlesController.createArticle)
      .use(ArticlesController.retrieveArticleById)
      .use(ArticlesController.editArticleById)
      .use(ArticlesController.removeArticleById),
)
