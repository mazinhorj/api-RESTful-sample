// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    transactions: {
      id: string
      title: string
      amount: number
      createdAt: string
      session_id?: string
    }
  }
}

// este arquivo contém configurações para uso do knex com typescript - tipagem dos campos presentes nas tabelas do banco de dados
