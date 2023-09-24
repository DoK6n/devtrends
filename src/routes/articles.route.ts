import { Elysia } from 'elysia'
import { setup } from '../config'
import {
  addArticleModel,
  articleListResponseModel,
  articleResponseModel,
} from '../models'

export const articlesRoute = new Elysia().group('/v1', app =>
  app
    .use(setup)
    .use(addArticleModel)
    .use(articleResponseModel)
    .use(articleListResponseModel)
    .get(
      'articles',
      async ({ db }) => {
        const articleList = await db.getArticles()
        return {
          data: articleList,
        }
      },
      {
        response: 'articleListResponse',
      },
    )
    .post(
      'articles/add',
      async ({ db, body }) => {
        const createdArticle = await db.addArticle(body)
        return {
          data: createdArticle,
        }
      },
      {
        body: 'addArticle',
        response: 'articleResponse',
      },
    ),
)
