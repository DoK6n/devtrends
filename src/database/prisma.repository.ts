import { PrismaClient } from '@prisma/client'
import { prisma as prismaClient } from '../database'

export default abstract class PrismaRepository {
  protected prisma: PrismaClient = prismaClient

  // disconnect() {
  //   this.prisma.$disconnect()
  // }
}
