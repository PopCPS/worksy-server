import fastify from "fastify";
import cors from "@fastify/cors"
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import fastifyCookie from "@fastify/cookie";
import { JWT_SECRET } from "./lib/secrets";
import fastifyJwt from "@fastify/jwt";
import { register } from "./routes/auth/register";
import { login } from "./routes/auth/login";
import { logout } from "./routes/auth/logout";
import { getActivity } from "./routes/activity/get-activity";
import { postActivity } from "./routes/activity/post-activity";
import { deleteActivity } from "./routes/activity/delete-activity";
import { patchActivity } from "./routes/activity/patch-activity";
import { getAgenda } from "./routes/agenda/get-agenda";
import { postAgenda } from "./routes/agenda/post-agenda";
import { patchAgenda } from "./routes/agenda/patch-agenda";
import { deleteAgenda } from "./routes/agenda/delete-agenda";
import { getUser } from "./routes/user/get-user";
import { deleteUser } from "./routes/user/delete-user";
import { patchUser } from "./routes/user/patch-user";
import { ping } from "./routes/auth/ping";

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
app.register(ping)

app.register(getUser)
app.register(deleteUser)
app.register(patchUser)

app.register(getAgenda)
app.register(postAgenda)
app.register(deleteAgenda)
app.register(patchAgenda)

app.register(getActivity)
app.register(postActivity)
app.register(deleteActivity)
app.register(patchActivity)

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.listen({ port: 3333 }).then(() => {
  console.log('Server running!')
})