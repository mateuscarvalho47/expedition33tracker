import { resolve } from 'node:path'

import {
  PostgreSqlContainer,
  type StartedPostgreSqlContainer,
} from '@testcontainers/postgresql'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { createDatabase, type DatabaseClient } from '~/db/client.server'
import { authRateLimits, userProgress, users } from '~/db/schema'
import {
  AuthRateLimitError,
  createAuthRateLimiter,
} from '~/features/auth/rate-limit.server'

import { createProgressRepository } from './progress.repository.server'

const userId = '0198fdf0-35b6-7000-8000-000000000001'
let container: StartedPostgreSqlContainer
let db: DatabaseClient
let closeDatabase: () => Promise<void>

beforeAll(async () => {
  container = await new PostgreSqlContainer('postgres:17-alpine').start()
  const connection = createDatabase(container.getConnectionUri(), 1)
  db = connection.db
  closeDatabase = connection.close
  await migrate(db, { migrationsFolder: resolve('drizzle') })
})

beforeEach(async () => {
  await db.delete(authRateLimits)
  await db.delete(userProgress)
  await db.delete(users)
  await db.insert(users).values({
    id: userId,
    email: 'sciel@example.com',
    displayName: 'Sciel',
    profileSlug: 'sciel-12345678',
    passwordHash: 'not-used-in-this-test',
  })
})

afterAll(async () => {
  await closeDatabase()
  await container.stop()
})

describe('repositório de progresso com PostgreSQL', () => {
  it('grava um item de modo idempotente', async () => {
    const repository = createProgressRepository(db)

    await repository.setCompleted(userId, 'lumiere', true)
    await repository.setCompleted(userId, 'lumiere', true)

    expect(await repository.listCompletedIds(userId)).toEqual(['lumiere'])
  })

  it('remove apenas o item desmarcado', async () => {
    const repository = createProgressRepository(db)
    await repository.setCompleted(userId, 'lumiere', true)
    await repository.setCompleted(userId, 'gustave', true)

    await repository.setCompleted(userId, 'lumiere', false)

    expect(await repository.listCompletedIds(userId)).toEqual(['gustave'])
  })

  it('aplica atualização em lote sem afetar itens de outro tracker', async () => {
    const repository = createProgressRepository(db)
    await repository.setCompleted(userId, 'j-verso', true)

    await repository.setMany(userId, ['lumiere', 'gustave'], true)
    await repository.setMany(userId, ['lumiere', 'gustave'], false)

    expect(await repository.listCompletedIds(userId)).toEqual(['j-verso'])
  })

  it('substitui todo o progresso em uma transação', async () => {
    const repository = createProgressRepository(db)
    await repository.setMany(userId, ['lumiere', 'gustave'], true)

    await repository.replaceAll(userId, ['childrenoflumiere', 'j-e35'])

    expect((await repository.listCompletedIds(userId)).sort()).toEqual([
      'childrenoflumiere',
      'j-e35',
    ])
  })
})

describe('rate limit com PostgreSQL', () => {
  it('persiste o bloqueio depois de exceder a janela de tentativas', async () => {
    const limiter = createAuthRateLimiter(db)

    for (let attempt = 0; attempt < 6; attempt += 1) {
      await limiter.consume('login', '203.0.113.10', 'sciel@example.com')
    }

    await expect(
      limiter.consume('login', '203.0.113.10', 'sciel@example.com'),
    ).rejects.toBeInstanceOf(AuthRateLimitError)

    const [persistedLimit] = await db.select().from(authRateLimits)
    expect(persistedLimit.attempts).toBe(7)
    expect(persistedLimit.blockedUntil?.getTime()).toBeGreaterThan(Date.now())

    await expect(
      limiter.consume('login', '203.0.113.10', 'sciel@example.com'),
    ).rejects.toBeInstanceOf(AuthRateLimitError)
    const [unchangedLimit] = await db.select().from(authRateLimits)
    expect(unchangedLimit.attempts).toBe(7)
  })
})
