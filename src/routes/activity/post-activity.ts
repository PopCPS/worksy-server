import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { jwtPayload } from "../../lib/interfaces/jwtPayload";
import { prisma } from "../../lib/prisma";

export const postActivity = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post('/api/activities', {
    schema: {
      body: z.object({
        title: z.string().min(3),
        occurs_at: z.coerce.date() 
      })
    }
  }, async (request, reply) => {

    const { id } = await request.jwtDecode() as jwtPayload

    const { title, occurs_at } = request.body

    if(!title || !occurs_at) {
      reply.code(400).send({ error: 'Dados incompletos' })
      return
    }

    const activity = await prisma.activity.create({
      data: {
        user_id: id,
        title,
        occurs_at,
      }
    })

    reply.code(200).send('Atividade criada com sucesso.')
    return activity
  })
}