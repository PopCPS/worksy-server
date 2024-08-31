import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { jwtPayload } from "../../lib/interfaces/jwtPayload";
import { prisma } from "../../lib/prisma";
import z from "zod";

export const getActivity = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get('/api/activities', {
    schema: {
      body: z.object({
        occurs_at: z.coerce.date()
      })
    }
  }, 
    async (request, reply) => {
      
      const { id, email } = await request.jwtDecode() as jwtPayload

      const { occurs_at } = request.body

      const activities = prisma.activity.findMany({ 
        where: {
          id,
          occurs_at,
          user: {
            email
          }
        }
      })

      reply.code(200)
      return activities

    }
  )
}