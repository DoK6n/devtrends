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

export const articleUpdateModel = (app: Elysia) =>
  app.model({
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

export const articleDeleteModel = (app: Elysia) =>
  app.model({
    articleId,
    deleteArticleResponse: t.Object({
      data: t.Object({
        id: t.Number(),
      }),
    }),
  })

export const articleModel = (app: Elysia) =>
  app
    .use(addArticleModel)
    .use(findArticleModel)
    .use(articleResponseModel)
    .use(articleListResponseModel)
    .use(articleUpdateModel)
    .use(articleDeleteModel)
