import Elysia, { t } from 'elysia'

// const id = t.Object({
//   id: t.Number(),
// })

const article = t.Object({
  id: t.Number(),
  title: t.String(),
  author: t.String(),
})

const articleList = t.Array(article)

export const addArticleModel = (app: Elysia) =>
  app.model({
    addArticle: t.Object({
      title: t.String(),
      author: t.String(),
    }),
  })

export const findArticleModel = (app: Elysia) =>
  app.model({
    findArticle: t.Object({
      articleId: t.Numeric(),
    }),
  })

export const articleResponseModel = (app: Elysia) =>
  app.model({
    articleResponse: t.Object({
      data: article,
    }),
  })

export const articleListResponseModel = (app: Elysia) =>
  app.model({
    articleListResponse: t.Object({
      data: articleList,
    }),
  })
