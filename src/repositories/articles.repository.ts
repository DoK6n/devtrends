import Elysia from 'elysia'
import PrismaRepository from 'src/database/prisma.repository'
import { ArticleId, CreateArticle, EditArticle } from 'src/models'

export class ArticlesRepository extends PrismaRepository {
  constructor() {
    super()
  }

  findArticles() {
    return this.prisma.articles.findMany()
  }

  findArticleById(articleId: ArticleId) {
    return this.prisma.articles.findUnique({
      where: {
        id: articleId,
      },
    })
  }

  createArticle(articles: CreateArticle) {
    return this.prisma.articles.create({
      data: articles,
    })
  }

  updateArticle(articleId: ArticleId, articles: EditArticle) {
    return this.prisma.articles.update({
      where: {
        id: articleId,
      },
      data: {
        title: articles.title,
        author: articles.author,
      },
    })
  }

  removeArticleById(articleId: ArticleId) {
    return this.prisma.articles.delete({
      where: {
        id: articleId,
      },
    })
  }
}

export const articlesRepository = new Elysia({
  name: 'articlesRepository',
}).decorate('articlesRepository', new ArticlesRepository())
