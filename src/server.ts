import fastify from 'fastify'
import crypto from 'node:crypto'
import { knex } from './dbase'
import { env } from './env'

const app = fastify()

app.get('/hello', async () => {
  const transaction = await knex('transactions')
    .insert({
      id: crypto.randomUUID(),
      title: 'Trans teste',
      amount: 1250,
    })
    .returning('*')
  return transaction
})

app.get('/hello/all', async () => {
  const transaction = await knex('transactions').select('*')
  return transaction
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
