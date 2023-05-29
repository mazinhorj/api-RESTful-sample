import fastify from 'fastify'

const app = fastify()

app.get('/hello', () => {
  return '?Hello, RESTful World!'
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
