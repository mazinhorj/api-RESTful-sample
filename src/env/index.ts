import { config } from 'dotenv'

import { z } from 'zod'

console.log(`Executando ambiente: ${process.env.NODE_ENV}`)

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test', override: true }) // sem o override não rola!
} else {
  config()
}

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
