import { execSync } from 'node:child_process'
import reqs from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '../src/app'

describe('Transactions Routes', () => {
  beforeAll(async () => {
    execSync('npm run knex migrate:latest')
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a new transaction', async () => {
    // test pode ser 'it' que deve ser importado
    // const resp =
    const resp = await reqs(app.server)
      .post('/transactions')
      .send({
        title: 'Test Transaction Creation',
        amount: 5500,
        type: 'credit',
      })
      .expect(201)

    console.log(
      'Deveria vir o que foi inserido no banco de testes > criação...',
    )
    console.log(resp)

    // expect(resp.statusCode).toEqual(201) // essa sintaxe depende da importação da lib expect de dentro do vitest e colocar o fluxo de teste dentro de uma variável. Simplifica-se com o .expect() ao final
  })

  it('should be able to list all transactions', async () => {
    // test pode ser 'test' que deve ser importado
    // const resp =
    const createTransactionResponse = await reqs(app.server)
      .post('/transactions')
      .send({
        title: 'Test Transaction List',
        amount: 5500,
        type: 'credit',
      })

    console.log('Deveria vir o que foi inserido no banco de testes > lista...')
    console.log(createTransactionResponse.body)

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionsResp = await reqs(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    expect(listTransactionsResp.body.transactions).toEqual([
      expect.objectContaining({
        title: 'Test Transaction List',
        amount: 5500,
      }),
    ])
  })
})
