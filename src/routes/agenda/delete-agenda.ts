import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";

export const deleteAgenda = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().delete('/api/agenda', {
    schema: {
      body: z.object({
        agendaId: z.string().uuid()
      })
    }
  }, async (request, reply) => {

    await request.jwtVerify()
    const { agendaId } = await request.body

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

    reply.code(200).send('Agenda deletada com sucesso.')
  })
}