import Elysia from 'elysia'
import {
  createArticleModel,
  articleDeleteModel,
  articlesResponseModel,
  articleResponseModel,
  articleEditModel,
  findArticleModel,
} from 'src/models'
import { articlesRepository } from 'src/repositories'

export namespace ArticlesController {
  export const retrieveArticles = new Elysia({ name: 'retrieveArticles' })
    .use(articlesRepository)
    .use(articlesResponseModel)
    .get(
      '',
      async ({ articlesRepository }) => {
        const articles = await articlesRepository.findArticles()
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
    .use(articlesRepository)
    .use(createArticleModel)
    .use(articleResponseModel)
    .post(
      '',
      async ({ body, articlesRepository }) => {
        const createdArticle = await articlesRepository.createArticle(body)

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
    .use(articlesRepository)
    .use(findArticleModel)
    .use(articleResponseModel)
    .get(
      '/:articleId',
      async ({ params, articlesRepository }) => {
        const retrievedArticle = await articlesRepository.findArticleById(
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
    .use(articlesRepository)
    .use(articleEditModel)
    .patch(
      '/:articleId',
      async ({ params, body, articlesRepository }) => {
        const editedArticle = await articlesRepository.updateArticle(
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
    .use(articlesRepository)
    .use(articleDeleteModel)
    .delete(
      '/:articleId',
      async ({ params, articlesRepository }) => {
        const deletedArticleId = await articlesRepository.removeArticleById(
          params.articleId,
        )

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
