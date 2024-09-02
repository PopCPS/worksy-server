import { ZodTypeProvider } from "fastify-type-provider-zod";
import { FastifyInstance } from "fastify/types/instance";
import z from "zod";
import { jwtPayload } from "../../lib/interfaces/jwtPayload";
import { prisma } from "../../lib/prisma";

export const deleteActivity = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().delete('/api/activities', {
    schema: {
      body: z.object({
        activity_id: z.string().uuid()
      })
    }
  }, async (request, reply) => {

    await request.jwtDecode() as jwtPayload

    const { activity_id } = request.body

    const activity = prisma.activity.delete({
      where: {
        id: activity_id
      }
    })

    reply.code(200).send('Atividade apagada com sucesso.')
    return activity
  })
}