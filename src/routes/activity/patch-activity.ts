import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { jwtPayload } from "../../lib/interfaces/jwtPayload";
import { prisma } from "../../lib/prisma";

export const patchActivity = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().patch('/api/activities', {
    schema: {
      body: z.object({
        activity_id: z.string(),
        title: z.string().optional(),
        is_done: z.boolean(),
        date: z.string().date().optional(),
        occurs_at: z.coerce.date().optional()
      })
    }
  }, async (request, reply) => {

    await request.jwtVerify() as jwtPayload

    const {
      activity_id,
      title,
      is_done,
      date,
      occurs_at
    } = request.body

    const activity = await prisma.activity.findFirst({
      where: {
        id: activity_id,
      },
    })

    if(!activity) {
      reply.code(404).send('Atividade não encontrada')
      return
    }

    const patchedActivity = await prisma.activity.update({
      where: {
        id: activity_id
      },
      data: {
        title: title || activity.title,
        date: date || activity.date,
        occurs_at: occurs_at || activity.occurs_at,
        is_done: is_done,
      }
    })

    reply.code(200).send('Atividade atualizada.')
    return patchedActivity

  })
}