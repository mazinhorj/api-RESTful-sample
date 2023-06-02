import 'dotenv/config'

import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['production', 'test', 'development']).default('production'), //
  DATABASE_URL: z.string(),
  PORT: z.number().default(3333),
})

const _env = envSchema.safeParse(process.env)
if (_env.success === false) {
  console.error('Deu merda nas variáveis de ambiente!', _env.error.format())
  throw new Error('Deu merda nas variáveis de ambiente!')
}
export const env = _env.data
