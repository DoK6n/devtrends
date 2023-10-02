import Elysia from 'elysia'
import { setup } from 'src/config'
import {
  addArticleModel,
  articleDeleteModel,
  articleListResponseModel,
  articleResponseModel,
  articleUpdateModel,
  findArticleModel,
} from 'src/models'

export namespace ArticlesController {
  export const retrieveArticles = new Elysia({ name: 'retrieveArticles' })
    .use(setup)
    .use(articleListResponseModel)
    .get(
      '',
      async ({ prisma }) => {
        const articleList = await prisma.articles.findMany()
        return {
          data: articleList,
        }
      },
      {
        response: 'articleListResponse',
      },
    )

  export const addArticles = new Elysia({ name: 'addArticles' })
    .use(setup)
    .use(addArticleModel)
    .use(articleResponseModel)
    .post(
      '/add',
      async ({ body, prisma }) => {
        const createdArticle = await prisma.articles.create({
          data: body,
        })

        return {
          data: createdArticle,
        }
      },
      {
        body: 'addArticle',
        response: 'articleResponse',
      },
    )

  export const retrieveArticleById = new Elysia({ name: 'retrieveArticleById' })
    .use(setup)
    .use(findArticleModel)
    .use(articleResponseModel)
    .get(
      '/:articleId',
      async ({ params, prisma }) => {
        const retrievedArticle = await prisma.articles.findUnique({
          where: {
            id: params.articleId,
          },
        })

        return {
          data: retrievedArticle || {},
        }
      },
      {
        params: 'findArticle',
        response: 'articleResponse',
      },
    )

  export const updateArticleById = new Elysia({ name: 'updateArticleById' })
    .use(setup)
    .use(articleUpdateModel)
    .patch(
      '/update/:articleId',
      async ({ params, body, prisma }) => {
        const updatedArticle = await prisma.articles.update({
          where: {
            id: params.articleId,
          },
          data: {
            title: body.title,
            author: body.author,
          },
        })

        return {
          data: updatedArticle,
        }
      },
      {
        params: 'articleId',
        body: 'updateArticleBody',
        response: 'updateArticleResponse',
      },
    )

  export const removeArticleById = new Elysia({ name: 'removeArticleById' })
    .use(setup)
    .use(articleDeleteModel)
    .delete(
      '/remove/:articleId',
      async ({ params, prisma }) => {
        const deletedArticleId = await prisma.articles.delete({
          where: {
            id: params.articleId,
          },
          select: {
            id: true,
          },
        })

        return {
          data: deletedArticleId,
        }
      },
      {
        params: 'articleId',
        response: 'deleteArticleResponse',
      },
    )
}
