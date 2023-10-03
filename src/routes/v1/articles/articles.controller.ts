import Elysia from 'elysia'
import {
  createArticleModel,
  articleDeleteModel,
  articlesResponseModel,
  articleResponseModel,
  articleEditModel,
  findArticleModel,
} from 'src/models'
import { articlesRepository } from 'src/repositories/articles'
import { articlesService } from 'src/services'

export namespace ArticlesController {
  export const retrieveAllArticles = new Elysia({ name: 'retrieveArticles' })
    .use(articlesService)
    .use(articlesResponseModel)
    .get(
      '',
      async ({ articlesService }) => {
        const articles = await articlesService.fetchArticles()
        return {
          data: articles,
        }
      },
      {
        response: 'articlesResponse',
      },
    )

  /**
   * 새로운 article을 저장합니다.
   */
  export const createArticle = new Elysia({ name: 'createArticle' })
    .use(articlesService)
    .use(createArticleModel)
    .use(articleResponseModel)
    .post(
      '',
      async ({ body, articlesService }) => {
        const createdArticle = await articlesService.createArticle(body)

        return {
          data: createdArticle,
        }
      },
      {
        body: 'createArticleBody',
        response: 'articleResponse',
      },
    )

  export const retrieveArticleById = new Elysia({ name: 'retrieveArticleById' })
    .use(articlesService)
    .use(findArticleModel)
    .use(articleResponseModel)
    .get(
      '/:articleId',
      async ({ params, articlesService }) => {
        const retrievedArticle = await articlesService.fetchArticleById(
          params.articleId,
        )

        return {
          data: retrievedArticle || {},
        }
      },
      {
        params: 'findArticle',
        response: 'articleResponse',
      },
    )

  export const editArticleById = new Elysia({ name: 'editArticleById' })
    .use(articlesService)
    .use(articleEditModel)
    .patch(
      '/:articleId',
      async ({ params, body, articlesService }) => {
        const editedArticle = await articlesService.editArticleById(
          params.articleId,
          body,
        )

        return {
          data: editedArticle,
        }
      },
      {
        params: 'articleId',
        body: 'editArticleBody',
        response: 'editArticleResponse',
      },
    )

  export const removeArticleById = new Elysia({ name: 'removeArticleById' })
    .use(articlesService)
    .use(articleDeleteModel)
    .delete(
      '/:articleId',
      async ({ params, articlesService }) => {
        const deletedArticleId =
          await articlesService.labelInvalidArticleRecordById(params.articleId)

        return {
          data: {
            id: deletedArticleId.id,
          },
        }
      },
      {
        params: 'articleId',
        response: 'deleteArticleResponse',
      },
    )
}
