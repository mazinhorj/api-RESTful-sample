import reqs from 'supertest'
import { afterAll, beforeAll, test } from 'vitest'
import { app } from '../src/app'

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

test('User can create new transaction', async () => {
  // const resp =
  await reqs(app.server)
    .post('/transactions')
    .send({
      title: 'Test Transaction',
      amount: 5500,
      type: 'credit',
    })
    .expect(201)

  // expect(resp.statusCode).toEqual(201) // essa sintaxe depende da importação da lib expect de dentro do vitest e colocar o fluxo de teste dentro de uma variável. Simplifica-se com o .expect() ao final
})
