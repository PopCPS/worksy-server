import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { jwtPayload } from "../../lib/interfaces/jwtPayload";
import { prisma } from "../../lib/prisma";

export const patchAgenda = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().patch('/api/agenda', {
    schema: {
      body: z.object({
        agendaId: z.string().uuid(),
        name: z.string()
      })
    }
  }, async (request, reply) => {

    await request.jwtVerify() as jwtPayload
    const { agendaId, name } = await request.body

    let agenda = await prisma.agenda.findFirst({
      where: {
        id: agendaId
      }
    })

    if(!agenda) {
      reply.code(404).send({ error: 'Agenda não encontrada' })
      return
    }

    agenda = await prisma.agenda.update({
      where: {
        id: agenda.id,
      },
      data: {
        name
      }
    })

    reply.code(200).send('Agenda atualizada com sucesso.')

  })
}