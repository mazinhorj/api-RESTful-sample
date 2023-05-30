import fastify from 'fastify'
import { knex } from './dbase'

const app = fastify()

app.get('/hello', async () => {
  const test = await knex('sqlite_schema').select('*')
  return test
})

const theAuthor: string = 'Osmar Menezes da Silva (Mazinho)'
app
  .listen({
    port: 3333,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log(
      `-> Desenvolvido por ${theAuthor} \n-> ✅ Servidor rodando em http://localhost:3333`,
    )
  })
