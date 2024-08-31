import fastify from "fastify";
import cors from "@fastify/cors"
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import fastifyCookie from "@fastify/cookie";
import { JWT_SECRET, PORT } from "./lib/secrets";
import fastifyJwt from "@fastify/jwt";
import { register } from "./routes/auth/register";
import { login } from "./routes/auth/login";
import { logout } from "./routes/auth/logout";

const app = fastify()

app.register(cors, {
  origin: true,
  credentials: true,
})

app.register(fastifyCookie, {});
app.register(fastifyJwt, {
  secret: JWT_SECRET,
  cookie: {
    cookieName: 'token',
    signed: false,
  },
})

app.register(register)
app.register(login)
app.register(logout)

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.listen({ port: 3333 }).then(() => {
  console.log('Server running!')
})