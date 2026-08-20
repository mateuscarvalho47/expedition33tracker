import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as schema from './schema'

const developmentDatabaseUrl =
  'postgresql://expedition33:expedition33@127.0.0.1:5432/expedition33'

export function createDatabase(url: string, maxConnections = 10) {
  const client = postgres(url, {
    max: maxConnections,
    idle_timeout: 20,
    connect_timeout: 10,
  })

  return {
    db: drizzle({ client, schema }),
    client,
    close: () => client.end(),
  }
}

export type DatabaseClient = ReturnType<typeof createDatabase>['db']

const globalDatabase = globalThis as typeof globalThis & {
  __expedition33Database?: ReturnType<typeof createDatabase>
}

function getDatabase() {
  if (!globalDatabase.__expedition33Database) {
    const url = process.env.DATABASE_URL ?? developmentDatabaseUrl
    globalDatabase.__expedition33Database = createDatabase(url)
  }

  return globalDatabase.__expedition33Database
}

export const database = getDatabase().db

export async function checkDatabaseConnection() {
  await getDatabase().client`select 1`
}
