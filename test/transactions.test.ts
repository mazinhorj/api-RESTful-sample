import { execSync } from 'node:child_process'
import reqs from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../src/app'

describe('Transactions Routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new transaction', async () => {
    // test pode ser 'it' que deve ser importado
    // const resp =
    await reqs(app.server)
      .post('/transactions')
      .send({
        title: 'Test Transaction Creation',
        amount: 5500,
        type: 'credit',
      })
      .expect(201)

    // expect(resp.statusCode).toEqual(201) // essa sintaxe depende da importação da lib expect de dentro do vitest e colocar o fluxo de teste dentro de uma variável. Simplifica-se com o .expect() ao final
  })

  it('should be able to list all transactions', async () => {
    const createTransactionResponse = await reqs(app.server)
      .post('/transactions')
      .send({
        title: 'Test Transaction List',
        amount: 5500,
        type: 'credit',
      })

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

  it('should be able to list a specific transactions', async () => {
    const createTransactionResponse = await reqs(app.server)
      .post('/transactions')
      .send({
        title: 'Test Transaction List',
        amount: 5500,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionsResp = await reqs(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    const transactionId = listTransactionsResp.body.transactions[0].id

    const getTransactionsResp = await reqs(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(getTransactionsResp.body.transaction).toEqual(
      expect.objectContaining({
        title: 'Test Transaction List',
        amount: 5500,
      }),
    )
  })

  it('should be able to get the summary', async () => {
    // test pode ser 'test' que deve ser importado
    // const resp =
    const createTransactionResponse = await reqs(app.server)
      .post('/transactions')
      .send({
        title: 'Test Credit Transaction List',
        amount: 8500,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    await reqs(app.server).post('/transactions').set('Cookie', cookies).send({
      title: 'Test Debit Transaction List',
      amount: 3000,
      type: 'debit',
    })

    const summaryTransactionsResp = await reqs(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)
      .expect(200)

    expect(summaryTransactionsResp.body.summary).toEqual({
      amount: 5500,
    })
  })
})
