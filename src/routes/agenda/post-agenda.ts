import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
import { jwtPayload } from "../../lib/interfaces/jwtPayload"
import { prisma } from "../../lib/prisma"

export const postAgenda = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post('/api/agenda', {
    schema: {
      body: z.object({
        title: z.string()
      })
    }
  }, async (request, reply) => {

    const { id } = await request.jwtDecode() as jwtPayload
    const { title } = request.body

    if(!title) {
      reply.code(400).send({ error: 'Dados incompletos.'})
      return
    }

    let agenda = await prisma.agenda.findFirst({
      where: {
        user_id: id,
        name: title
      }
    })

    if(agenda) {
      reply.code(409).send({ error: 'Agenda com nome repedido.'})
      return
    }

    agenda = await prisma.agenda.create({
      data: {
        user_id: id,
        name: title
      }
    })

    reply.code(200).send(agenda.id)
  })
}