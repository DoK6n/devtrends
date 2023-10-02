import { t } from 'elysia'
import { Static } from '@sinclair/typebox'

export const article = t.Object({
  id: t.Number(),
  title: t.String(),
  author: t.String(),
})

export const articleId = t.Object({
  articleId: t.Numeric(),
})

export const createArticleBody = t.Object({
  title: t.String(),
  author: t.String(),
})

export const editArticleBody = t.Object({
  title: t.String(),
  author: t.String(),
})

export const articles = t.Array(article)

export type ArticleId = Static<typeof articleId>['articleId']
export type Article = Static<typeof article>
export type CreateArticle = Static<typeof createArticleBody>
export type EditArticle = Static<typeof editArticleBody>
