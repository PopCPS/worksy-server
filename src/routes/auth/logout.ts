import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export const logout = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post('/api/logout', {},
    async (request, reply) => {
      if(reply.getHeader('token')) {
        reply.setCookie('token', '', {
          httpOnly: true,
          secure: true,
          maxAge: Date.now()
        })
      }
      if(reply.getHeader('agenda')) {
        reply.setCookie('agenda', '', {
          httpOnly: false,
          secure: true,
        })
      }
    }
  )
}