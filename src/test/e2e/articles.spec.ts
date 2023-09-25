// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { beforeEach, describe, expect, it } from 'bun:test'
import { post, req, reqBase } from '../client'
import { Article } from 'src/repositories'
import Elysia from 'elysia'
import { database } from 'src/database'
import { articlesRoute } from 'src/routes'

describe('E2E articles test', () => {
  const _serve = { serve: { hostname: 'localhost' } }
  // TODO 테스트 종료 후 테스트용 데이터 제거

  const app = new Elysia(_serve)
    .get('/', () => 'healthy')
    .use(database)
    .use(articlesRoute())

  describe('health check', () => {
    it('health check', async () => {
      const response = await app.handle(reqBase('/'))

      expect(await response.text()).toBe('healthy')
    })
  })

  let article: Article

  /**
   * 테스트용 게시글 생성
   */
  beforeEach(async () => {
    const response = await app.handle(
      post('/articles/add', {
        title: 'Elysia!!',
        author: 'dok6n',
      }),
    )

    if (!response.ok) throw new Error('Article 생성 실패')

    article = (await response.json()).data
  })

  describe('GET /v1/articles', () => {
    it('전체 게시글 조회 테스트', async () => {
      const response = await (await app.handle(req('/articles'))).json()

      expect((await response.data) instanceof Array).toStrictEqual(true)
    })
  })

  describe('GET /v1/articles/:articlesId', () => {
    it('게시글 조회 테스트', async () => {
      const response = await app.handle(req(`/articles/${article.id}`))

      expect(await response.json()).toStrictEqual({ data: article })
    })
  })
})