import 'dotenv/config'
import { Knex, knex as setKnex } from 'knex'
import { env } from './env'

export const config: Knex.Config = {
  client: 'sqlite',
  connection: {
    filename: env.DATABASE_URL, // './db/tmp/app.db', // pode ser .sqlite
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
}

export const knex = setKnex(config)
