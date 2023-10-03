import Elysia from 'elysia'
import { Article, ArticleId, CreateArticle, EditArticle } from 'src/models'
import { ArticlesRepository } from 'src/repositories'

interface IArticlesService {
  fetchArticles: () => Promise<Article[]>
  createArticle: (articleToCreate: CreateArticle) => Promise<Article>
  fetchArticleById: (id: ArticleId) => Promise<Article | null>
  editArticleById: (
    id: ArticleId,
    articleToEdit: EditArticle,
  ) => Promise<Article>
  labelInvalidArticleRecordById: (id: ArticleId) => Promise<Article>
}

export class ArticlesService implements IArticlesService {
  constructor(private readonly articlesRepository: ArticlesRepository) {}

  async fetchArticles() {
    return this.articlesRepository.findArticles()
  }

  async createArticle(articleToCreate: CreateArticle) {
    return this.articlesRepository.createArticle(articleToCreate)
  }

  async fetchArticleById(id: ArticleId) {
    return this.articlesRepository.findArticleById(id)
  }

  async editArticleById(id: ArticleId, articleToEdit: EditArticle) {
    return this.articlesRepository.updateArticle(id, articleToEdit)
  }

  async labelInvalidArticleRecordById(id: ArticleId) {
    return this.articlesRepository.removeArticleById(id)
  }
}

export const articlesService = new Elysia({
  name: 'articlesService',
}).decorate('articlesService', new ArticlesService(new ArticlesRepository()))
