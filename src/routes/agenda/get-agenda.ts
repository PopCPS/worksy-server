import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { jwtPayload } from "../../lib/interfaces/jwtPayload"
import { prisma } from "../../lib/prisma"

export const getAgenda = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get('/api/agenda', {}, 
    async (request) => {

    const { id } = await request.jwtVerify() as jwtPayload

    const agendas = await prisma.agenda.findMany({
      where: {
        user_id: id
      },
      select: {
        id: true,
        name: true,
        user_id: true,
        activities: true,
      }
    })

    return agendas
  })
}