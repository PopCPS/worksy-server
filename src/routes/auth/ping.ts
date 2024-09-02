import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export const ping = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post('/api/ping' , {},
    async (request, reply) => {
      await request.jwtVerify()
      reply.code(200).send('Usuário autenticado.')
    }
  )
}