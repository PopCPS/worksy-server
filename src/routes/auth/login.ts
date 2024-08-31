import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";
import { compareSync } from "bcrypt";

export const login = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post('/api/login', {
    schema: {
      body: z.object({
        email: z.string().email(),
        password: z.string()
      })
    }
  }, async (request, reply) => {
    const { 
      email,
      password
    } = request.body

    if(!email || !password) {
      reply.code(400).send({ error: 'Dados incompletos' })
      return
    }

    let user = await prisma.user.findFirst({
      where: {
        email
      }
    })

    if(!user) {
      reply.code(404).send({ error: 'Usuário não encontrado '})
      return
    }

    if(!compareSync(password, user.password)) {
      reply.code(401).send({ error: 'Senha incorreta' })
    }

    const token = await reply.jwtSign({
      id: user.id,
      email: user.email,
    })

    reply.cookie('token', token, {
      maxAge: 60 * 60,
      path: '/',
      sameSite: 'none',
      httpOnly: false,
      secure: false
    })

    reply.code(200).send({ message: 'Usuário logado com sucesso', token })
    return token

  })
}