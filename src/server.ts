import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { env } from './env'
import { transactionsRoutes } from './routes/transactions'

const app = fastify()

app.register(cookie)
app.register(transactionsRoutes, {
  prefix: 'transactions',
})

const theAuthor: string = 'Osmar Menezes da Silva (Mazinho)'
app
  .listen({
    port: env.PORT,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log(
      `-> Desenvolvido por ${theAuthor} \n-> ✅ Servidor rodando em http://localhost:${env.PORT}`,
    )
  })
