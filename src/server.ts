import { app } from './app'
import { env } from './env'

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
