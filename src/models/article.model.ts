import Elysia, { t } from 'elysia'

const id = t.Object({
  id: t.Number(),
})

const article = t.Object({
  id: t.Number(),
  title: t.String(),
  author: t.String(),
})

const articleList = t.Array(article)

export const addArticleModel = new Elysia().model({
  addArticle: t.Object({
    title: t.String(),
    author: t.String(),
  }),
})

export const articleResponseModel = new Elysia().model({
  articleResponse: t.Object({
    data: id,
  }),
})

export const articleListResponseModel = new Elysia().model({
  articleListResponse: t.Object({
    data: articleList,
  }),
})
