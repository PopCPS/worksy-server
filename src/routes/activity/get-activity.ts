import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { jwtPayload } from "../../lib/interfaces/jwtPayload";
import { prisma } from "../../lib/prisma";
import z from "zod";

export const getActivity = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get('/api/activities/:agenda/:date/:substring?', {
    schema: {
      params: z.object({
        agenda: z.string(),
        date: z.string().date(),
        substring: z.string().optional()
      })
    }
  }, async (request, reply) => {
      
      const { id, email } = await request.jwtDecode() as jwtPayload

      const { agenda, date, substring } = request.params

      let agendaActivities
        
      if(substring) {
        agendaActivities = prisma.activity.findMany({ 
          where: {
            agenda_id: agenda,
            date,
            title: {
              contains: substring
            },
            user: {
              email,
              id
            }
          },
          orderBy: {
            occurs_at: 'asc'
          }
        })
      }

      if(!substring) {
        agendaActivities = prisma.activity.findMany({ 
          where: {
            agenda_id: agenda,
            date,
            user: {
              email,
              id
            }
          },
          orderBy: {
            occurs_at: 'asc'
          }
        })
      }

      reply.code(200)
      return agendaActivities
    }
  )
}