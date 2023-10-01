import Elysia, { t } from 'elysia'

const articleId = t.Object({
  articleId: t.Numeric(),
})

const article = t.Object({
  id: t.Number(),
  title: t.String(),
  author: t.String(),
})

const articleList = t.Array(article)

export const addArticleModel = new Elysia({ name: 'addArticle' }).model({
  addArticle: t.Object({
    title: t.String(),
    author: t.String(),
  }),
})

export const findArticleModel = new Elysia({ name: 'findArticle' }).model({
  findArticle: t.Object({
    articleId: t.Numeric(),
  }),
})

export const articleResponseModel = new Elysia({
  name: 'articleResponse',
}).model({
  articleResponse: t.Object({
    data: t.Union([article, t.Object({})]),
  }),
})

export const articleListResponseModel = new Elysia({
  name: 'findArticle',
}).model({
  articleListResponse: t.Object({
    data: articleList,
  }),
})

export const articleUpdateModel = new Elysia({
  name: 'articleUpdateModel',
}).model({
  articleId,
  updateArticleBody: t.Object({
    title: t.String(),
    author: t.String(),
  }),
  updateArticleResponse: t.Object({
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
  .use(addArticleModel)
  .use(findArticleModel)
  .use(articleResponseModel)
  .use(articleListResponseModel)
  .use(articleUpdateModel)
  .use(articleDeleteModel)
