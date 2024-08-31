import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { jwtPayload } from "../../lib/interfaces/jwtPayload";

export const patchActivity = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().patch('/api/activities', {
    schema: {
      body: z.object({
        activity_id: z.string(),
        title: z.string().optional(),
        isDone: z.boolean().optional(),
        occurs_at: z.coerce.date().optional()
      })
    }
  }, async (request, reply) => {

    const { id } = await request.jwtVerify() as jwtPayload

    const {
      activity_id,
      title,
      isDone,
      occurs_at
    } = request.body
  })
}