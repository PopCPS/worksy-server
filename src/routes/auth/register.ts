import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";
import { hashSync } from "bcrypt";

export const register = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post('/api/register', {
    schema: {
      body: z.object({
        name: z.string().min(4),
        email: z.string().email(),
        password: z.string().min(8),
        image: z.string().url().optional()
      }),
    },
  }, async (request, reply) => {
    const {
      name, 
      email,
      password,
      image
    } = request.body

    let user = await prisma.user.findFirst({
      where: {
        email
      }
    })

    if(user) {
      reply.code(409).send({ error: 'Usuário já existe '})
      return
    }

    if(password.length < 8) {
      reply.code(400).send({ error: 'Senha menor que o tamanho mínimo' })
      return
    }

    if(!name || !email || !password) {
      reply.code(400).send({ error: 'Dados incompletos'})
      return
    }

    user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashSync(password, 10),
        image,
      }
    })

    reply.code(200).send({ message: 'Usuário criado com sucesso' })
  })
}