import { FastifyInstance } from 'fastify'
import { execSync } from 'node:child_process'
import crypto, { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { knex } from '../dbase'
import { chkSessionIdExists } from '../middlewares/chk-sessionId-exists'

export async function transactionsRoutes(app: FastifyInstance) {
  // hook global para todas as rotas desse contexto
  app.addHook('preHandler', async (req, rep) => {
    console.log(`[${req.method}] -> ${req.url}`)
  })
  // C do CRUD
  app.post('/', async (req, rep) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createTransactionBodySchema.parse(req.body)

    let sessionId = req.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()
      rep.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      })
    }

    execSync('npm run knex migrate:latest')
    await knex('transactions')
      .insert({
        id: crypto.randomUUID(),
        title,
        amount: type === 'credit' ? amount : amount * -1,
        session_id: sessionId,
      })
      .returning('*')

    return rep.status(201).send()
  })

  // um dos R do CRUD
  app.get(
    '/:id',
    {
      preHandler: [chkSessionIdExists],
    },
    async (req, rep) => {
      const getTransactionParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { sessionId } = req.cookies
      const { id } = getTransactionParamsSchema.parse(req.params)

      const transaction = await knex('transactions')
        .where({
          session_id: sessionId,
          id,
        })
        .first()

      return { transaction }
    },
  )

  // também um R do CRUD
  app.get(
    '/summary',
    {
      preHandler: [chkSessionIdExists],
    },
    async (req, rep) => {
      const { sessionId } = req.cookies

      const summary = await knex('transactions')
        .where('session_id', sessionId)
        .sum('amount', { as: 'amount' })
        .first()

      return { summary }
    },
  )

  // THE 'R' do CRUD
  app.get(
    '/',
    {
      preHandler: [chkSessionIdExists],
    },
    async (req, rep) => {
      const { sessionId } = req.cookies

      // console.log('to passando')
      const transactions = await knex('transactions')
        .select('*') // pode dispensar o '*', mesmo resultado
        .where('session_id', sessionId)
        .orderBy('createdAt', 'desc')

      return { transactions }
    },
  )

  // rota perigosa... sem autenticação!
  app.get('/all', async (req, rep) => {
    const transaction = await knex('transactions')
      .select('*') // pode dispensar o '*', mesmo resultado
      .orderBy('createdAt', 'desc')

    return { transaction }
  })
}
