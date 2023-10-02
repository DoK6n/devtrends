import Elysia, { t } from 'elysia'
import {
  article,
  articleId,
  articles,
  createArticleBody,
  editArticleBody,
} from './types'

export const createArticleModel = new Elysia({
  name: 'createArticleModel',
}).model({
  createArticleBody,
})

export const findArticleModel = new Elysia({ name: 'findArticleModel' }).model({
  findArticle: t.Object({
    articleId: t.Numeric(),
  }),
})

export const articleResponseModel = new Elysia({
  name: 'articleResponseModel',
}).model({
  articleResponse: t.Object({
    data: t.Union([article, t.Object({})]),
  }),
})

export const articlesResponseModel = new Elysia({
  name: 'articlesResponseModel',
}).model({
  articlesResponse: t.Object({
    data: articles,
  }),
})

export const articleEditModel = new Elysia({
  name: 'articleEditModel',
}).model({
  articleId,
  editArticleBody,
  editArticleResponse: t.Object({
    data: t.Object({
      id: t.Number(),
      title: t.String(),
      author: t.String(),
    }),
  }),
})

export const articleDeleteModel = new Elysia({
  name: 'articleDeleteModel',
}).model({
  articleId,
  deleteArticleResponse: t.Object({
    data: t.Object({
      id: t.Number(),
    }),
  }),
})

export const articleModel = new Elysia({ name: 'articleModel' })
  .use(createArticleModel)
  .use(findArticleModel)
  .use(articleResponseModel)
  .use(articlesResponseModel)
  .use(articleEditModel)
  .use(articleDeleteModel)
