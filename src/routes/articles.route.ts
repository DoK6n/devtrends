import { Elysia } from 'elysia'
import { setup } from '../config'
import { articleModel } from 'src/models'

export const articlesRoute = () => (app: Elysia) =>
  app.group('/v1', app =>
    app
      .use(setup())
      .use(articleModel)
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
          response: 'articleResponse',
        },
      )
      .patch(
        '/articles/update/:articleId',
        async ({ db, params, body }) => {
          const updatedArticleId = await db.updateArticleById({
            id: params.articleId,
            title: body.title,
            author: body.author,
          })

          const retrievedArticle = await db.findArticleById(updatedArticleId.id)

          return {
            data: retrievedArticle,
          }
        },
        {
          params: 'articleId',
          body: 'updateArticleBody',
          response: 'updateArticleResponse',
        },
      )
      .delete(
        '/articles/remove/:articleId',
        async ({ db, params }) => {
          const deletedArticleId = await db.deleteArticleById(params.articleId)

          return {
            data: deletedArticleId,
          }
        },
        {
          params: 'articleId',
          response: 'deleteArticleResponse',
        },
      ),
  )
