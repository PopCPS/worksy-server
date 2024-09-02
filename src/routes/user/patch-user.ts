import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { jwtPayload } from "../../lib/interfaces/jwtPayload";
import { prisma } from "../../lib/prisma";

export const patchUser = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().patch('/api/user', {
    schema: {
      body: z.object({
        name: z.string().min(4),
        image: z.string().url()
      })
    }
  },
    async (request, reply) => {

      const { id } = await request.jwtVerify() as jwtPayload
      const { name, image } = request.body

      const user = await prisma.user.findFirst({
        where: {
          id
        }
      })

      if(!user) {
        reply.code(404).send({ error: 'Usuário não encontrado. '})
        return
      }

      await prisma.user.update({
        where: {
          id
        },
        data: {
          id: user.id,
          name: name || user.name,
          image: image || user.image
        }
      })

      reply.code(200).send('Usuário atualizado com sucesso.')
      return
    }
  )
}