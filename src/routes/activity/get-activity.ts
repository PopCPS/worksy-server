import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { jwtPayload } from "../../lib/interfaces/jwtPayload";
import { prisma } from "../../lib/prisma";
import z from "zod";

export const getActivity = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get('/api/activities/:agenda/:date', {
    schema: {
      params: z.object({
        agenda: z.string(),
        date: z.string().date()
      })
    }
  }, async (request, reply) => {
      
      const { id, email } = await request.jwtDecode() as jwtPayload

      const { agenda, date } = request.params
        
      const agendaActivities = prisma.activity.findMany({ 
        where: {
          agenda_id: agenda,
          date,
          user: {
            email,
            id
          }
        }
      })

      reply.code(200)
      return agendaActivities

    }
  )
}