import { describe, expect, it } from 'bun:test'
import Elysia from 'elysia'
// import { database } from 'src/database'

import { edenTreaty } from '@elysiajs/eden'
import { Articles, PrismaClient } from '@prisma/client'
import { createPinoLogger, loggingInterceptorPlugin } from 'src/common/plugins'
import { v1Routes } from 'src/routes'

const resetDataAndSeqArticles = async () => {
  const prisma = new PrismaClient()
  // const log = createPinoLogger()

  prisma.articles.deleteMany({})
  // await prisma.$queryRaw`TRUNCATE TABLE Articles RESTART IDENTITY`
  // log.warn('reset Articles data and auto increment to 1')
}

describe('E2E articles test', async () => {
  // const log = createPinoLogger()

  const _serve = { serve: { hostname: 'localhost' } }

  // eslint-disable-next-line no-magic-numbers
  const PORT = Bun.env.PORT || 8001

  const app = new Elysia(_serve)
    .get('/', () => 'healthy')
    // .use(database)
    .use(loggingInterceptorPlugin())
    .use(v1Routes)
    .listen(PORT)

  const client = edenTreaty<typeof app>(`http://localhost:${PORT}`)

  describe('health check', () => {
    it('health check', async () => {
      const response = await client.get()
      expect(response.data).toBe('healthy')
    })
  })

  describe('실제 데이터 테스트', async () => {
    await resetDataAndSeqArticles()
    let article: Articles
    const { data, error } = await client.v1.articles.post({
      title: 'Elysia!!',
      author: 'dok6n',
    })
    if (error) {
      createPinoLogger().error(error)
      throw new Error('Article 생성 실패')
    }
    article = data.data as Articles
    // /**
    //  * 테스트용 게시글 생성
    //  */
    // beforeEach(async () => {
    //   log.warn('테스트 케이스 1개 돌리기 전 호출')
    // })

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
        const resposnse = await client.v1.articles[article.id].patch({
          title: '수정된 게시글',
          author: 'tester',
        })

        expect(resposnse.data).toStrictEqual({
          data: {
            id: article.id,
            title: '수정된 게시글',
            author: 'tester',
          },
        })
      })
    })

    describe('DELETE /v1/articles/remove/:articleId', () => {
      it('게시글 삭제', async () => {
        await client.v1.articles.post({
          title: '게시글 삭제 테스트용 글',
          author: 'dok6n',
        })

        const lastArticle = await new PrismaClient().articles.findFirst({
          orderBy: {
            id: 'desc',
          },
        })

        if (!lastArticle) {
          throw new Error('마지막 Article 없음')
        }

        const { data } = await client.v1.articles[lastArticle.id].delete()

        expect(data).toStrictEqual({
          data: {
            id: lastArticle.id,
          },
        })
      })
    })
  })
})
