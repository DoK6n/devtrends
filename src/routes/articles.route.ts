import { Elysia } from 'elysia'
import { setup } from '../config'
import {
  addArticleModel,
  articleListResponseModel,
  articleResponseModel,
  findArticleModel,
} from '../models'

export const articlesRoute = () => (app: Elysia) =>
  app.group('/v1', app =>
    app
      .use(setup())
      .use(addArticleModel)
      .use(findArticleModel)
      .use(articleResponseModel)
      .use(articleListResponseModel)
      .get(
        '/articles',
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
        '/articles/add',
        async ({ db, body }) => {
          const createdArticleId = await db.addArticle(body)
          const retrievedArticle = await db.findArticleById(createdArticleId.id)

          return {
            data: retrievedArticle,
          }
        },
        {
          body: 'addArticle',
          response: 'articleResponse',
        },
      )
      .get(
        '/articles/:articleId',
        async ({ db, params }) => {
          const retrievedArticle = await db.findArticleById(params.articleId)

          return {
            data: retrievedArticle,
          }
        },
        {
          params: 'findArticle',
          response: 'articleResponse'
        },
      ),
  )
