import { Database } from 'bun:sqlite'
import { Logger } from 'src/common/plugins'

export interface Article {
  id: number
  title: string
  author: string
}

export interface CreateArticle extends Omit<Article, 'id'> {}

export class ArticlesRepository {
  private db: Database

  constructor(private readonly log: Logger) {
    this.db = new Database('./src/test/db/devtrends.db')
    this.init()
  }

  async getArticles() {
    return this.db.query(`SELECT * FROM articles`).all() as Article[]
  }

  async addArticle(article: CreateArticle) {
    return this.db
      .query(
        `INSERT INTO articles (title, author) VALUES ($title, $author) RETURNING id`,
      )
      .get({
        $title: article.title,
        $author: article.author,
      }) as Article
  }

  async findArticleById(id: number) {
    return this.db
      .query(`SELECT * FROM articles WHERE id = ?`)
      .get(id) as Article
  }

  async updateArticleById(article: Article) {
    return this.db
      .query(
        `UPDATE articles SET title = $title, author = $author WHERE id = $id RETURNING id`,
      )
      .get({
        $id: article.id,
        $title: article.title,
        $author: article.author,
      }) as { id: Article['id'] }
  }

  async deleteArticleById(id: number) {
    return this.db
      .query(`DELETE FROM articles WHERE id = ? RETURNING id`)
      .get(id) as { id: Article['id'] }
  }

  async init() {
    try {
      // 기존 테이블 삭제
      await this.db.run(`DROP TABLE IF EXISTS articles`)

      // 테이블 생성
      await this.db.run(
        `CREATE TABLE articles (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, author TEXT NOT NULL)`,
      )

      // await this.db.run(
      //   `CREATE TABLE IF NOT EXISTS articles (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, author TEXT NOT NULL)`,
      // )
      this.log.info('Database initialized')
    } catch (error) {
      this.log.error(error)
    }
  }
}
