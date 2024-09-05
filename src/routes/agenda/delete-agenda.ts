import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";
import { jwtPayload } from "../../lib/interfaces/jwtPayload";

export const deleteAgenda = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().delete('/api/agenda/:agendaId', {
    schema: {
      params: z.object({
        agendaId: z.string().uuid()
      })
    }
  }, async (request, reply) => {

    const { id, email } = await request.jwtVerify() as jwtPayload
    const { agendaId } = await request.params

    if(!agendaId) {
      reply.code(400).send({ error: 'Dados incompletos.' })
    }

    let agenda = await prisma.agenda.findFirst({
      where: {
        id: agendaId
      }
    })

    if(!agenda) {
      reply.code(404).send({ error: 'Agenda não encontrada.' })
      return
    }

    await prisma.activity.deleteMany({
      where: {
        agenda_id: agenda.id
      }
    })

    agenda = await prisma.agenda.delete({
      where: {
        id: agendaId
      }
    })

    const agendas = await prisma.agenda.findMany({
      where: {
        user: {
          id,
          email,
        },
      }
    })

    reply.code(200).send(agendas)
  })
}