// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { beforeEach, describe, expect, it } from 'bun:test'
import { Article } from 'src/repositories'
import Elysia from 'elysia'
import { database } from 'src/database'
import { articlesRoute } from 'src/routes'

import { edenTreaty } from '@elysiajs/eden'

describe('E2E articles test', () => {
  const _serve = { serve: { hostname: 'localhost' } }
  // TODO 테스트 종료 후 테스트용 데이터 제거

  // eslint-disable-next-line no-magic-numbers
  const PORT = Bun.env.PORT || 8001

  const app = new Elysia(_serve)
    .get('/', () => 'healthy')
    .use(database)
    .use(articlesRoute())
    .listen(PORT)

  const client = edenTreaty<typeof app>(`http://localhost:${PORT}`)

  describe('health check', () => {
    it('health check', async () => {
      const response = await client.get()
      expect(response.data).toBe('healthy')
    })
  })

  let article: Article

  describe('실제 데이터 테스트', () => {
    /**
     * 테스트용 게시글 생성
     */
    beforeEach(async () => {
      const { data, error } = await client.v1.articles.add.post({
        title: 'Elysia!!',
        author: 'dok6n',
      })

      if (error) {
        throw new Error('Article 생성 실패')
      }

      article = data.data
    })

    describe('GET /v1/articles', () => {
      it('전체 게시글 조회 테스트', async () => {
        const { data } = await client.v1.articles.get()

        expect(data?.data instanceof Array).toStrictEqual(true)
      })
    })

    describe('GET /v1/articles/:articlesId', () => {
      it('게시글 조회 테스트', async () => {
        const { data } = await client.v1.articles[article.id].get()

        expect(data).toStrictEqual({ data: article })
      })
    })

    describe('PATCH /v1/articles/update/:articleId', () => {
      it('게시글 업데이트', async () => {
        const resposnse = await client.v1.articles.update['1'].patch({
          title: '수정된 게시글',
          author: 'tester',
        })

        expect(resposnse.data).toStrictEqual({
          data: {
            id: 1,
            title: '수정된 게시글',
            author: 'tester',
          },
        })
      })
    })

    describe('DELETE /v1/articles/remove/:articleId', () => {
      it('게시글 삭제', async () => {
        const { data } = await client.v1.articles.remove['3'].delete()

        expect(data).toStrictEqual({
          data: {
            id: 3,
          },
        })
      })
    })
  })
})
