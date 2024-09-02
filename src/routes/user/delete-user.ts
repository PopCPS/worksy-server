import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { jwtPayload } from "../../lib/interfaces/jwtPayload";
import { prisma } from "../../lib/prisma";

export const deleteUser = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().delete('/api/user', {},
    async (request, reply) => {

      const { id } = await request.jwtVerify() as jwtPayload

      const user = await prisma.user.findFirst({
        where: {
          id
        }
      })

      if(!user) {
        reply.code(404).send({ error: 'Usuário não encontrado.' })
        return
      }

      await prisma.activity.deleteMany({
        where: {
          user_id: id
        }
      })

      await prisma.agenda.deleteMany({
        where: {
          user_id: id
        }
      })

      await prisma.user.delete({
        where: {
          id
        }
      })

      reply.code(200).send('Usuário apagado com sucesso.')

    }
  )
}