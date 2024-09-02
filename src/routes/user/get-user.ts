import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { jwtPayload } from "../../lib/interfaces/jwtPayload";
import { prisma } from "../../lib/prisma";

export const getUser = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get('/api/user', {},
    async (request, reply) => {

      const { id } = await request.jwtVerify() as jwtPayload

      let user = await prisma.user.findFirst({
        where: {
          id
        },
        select: {
          name: true,
          email: true,
          image: true,
        }
      })

      if(!user) {
        reply.code(404).send({ error: 'Usuário não encontrado.' })
        return
      }

      return user
    }
  )
}