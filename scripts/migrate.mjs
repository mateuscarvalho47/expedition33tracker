import { resolve } from 'node:path'

import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

const url =
  process.env.DATABASE_URL ??
  'postgresql://expedition33:expedition33@127.0.0.1:5432/expedition33'
const client = postgres(url, { max: 1 })

try {
  await migrate(drizzle(client), { migrationsFolder: resolve('drizzle') })
} finally {
  await client.end()
}
