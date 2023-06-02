import { FastifyInstance } from 'fastify'
import crypto from 'node:crypto'
import { z } from 'zod'
import { knex } from '../dbase'

export async function transactionsRoutes(app: FastifyInstance) {
  app.post('/', async (req, rep) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createTransactionBodySchema.parse(req.body)

    await knex('transactions')
      .insert({
        id: crypto.randomUUID(),
        title,
        amount: type === 'credit' ? amount : amount * -1,
      })
      .returning('*')
    return rep.status(201).send()
  })

  app.get('/', async () => {
    const transaction = await knex('transactions')
      .select('*')
      .orderBy('createdAt', 'desc')
    return transaction
  })
}
