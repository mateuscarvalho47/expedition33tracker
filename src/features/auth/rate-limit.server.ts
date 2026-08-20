import { createHash } from 'node:crypto'

import { eq, sql } from 'drizzle-orm'

import { type DatabaseClient, database } from '~/db/client.server'
import { authRateLimits } from '~/db/schema'

type AuthAction = 'login' | 'register'

const policies: Record<
  AuthAction,
  { maxAttempts: number; windowMilliseconds: number; blockMilliseconds: number }
> = {
  login: {
    maxAttempts: 6,
    windowMilliseconds: 15 * 60 * 1000,
    blockMilliseconds: 15 * 60 * 1000,
  },
  register: {
    maxAttempts: 5,
    windowMilliseconds: 60 * 60 * 1000,
    blockMilliseconds: 60 * 60 * 1000,
  },
}

export class AuthRateLimitError extends Error {
  constructor(readonly retryAfterSeconds: number) {
    super('AUTH_RATE_LIMITED')
  }
}

function createRateLimitKey(
  action: AuthAction,
  fingerprint: string,
  identifier?: string,
) {
  return createHash('sha256')
    .update(`${action}:${fingerprint}:${identifier ?? '*'}`)
    .digest('hex')
}

export function createAuthRateLimiter(db: DatabaseClient) {
  return {
    async consume(action: AuthAction, fingerprint: string, identifier?: string) {
      const key = createRateLimitKey(action, fingerprint, identifier)
      const policy = policies[action]

      const retryAfterSeconds = await db.transaction(async (transaction) => {
        await transaction.execute(sql`select pg_advisory_xact_lock(hashtext(${key}))`)

        const now = new Date()
        const [current] = await transaction
          .select()
          .from(authRateLimits)
          .where(eq(authRateLimits.key, key))
          .limit(1)

        if (current?.blockedUntil && current.blockedUntil > now) {
          return Math.max(
            1,
            Math.ceil((current.blockedUntil.getTime() - now.getTime()) / 1000),
          )
        }

        const windowExpired =
          !current ||
          now.getTime() - current.windowStartedAt.getTime() >= policy.windowMilliseconds
        const attempts = windowExpired ? 1 : current.attempts + 1
        const blockedUntil =
          attempts > policy.maxAttempts
            ? new Date(now.getTime() + policy.blockMilliseconds)
            : null

        await transaction
          .insert(authRateLimits)
          .values({
            key,
            attempts,
            windowStartedAt: windowExpired ? now : current.windowStartedAt,
            blockedUntil,
            updatedAt: now,
          })
          .onConflictDoUpdate({
            target: authRateLimits.key,
            set: {
              attempts,
              windowStartedAt: windowExpired ? now : current.windowStartedAt,
              blockedUntil,
              updatedAt: now,
            },
          })

        return blockedUntil ? policy.blockMilliseconds / 1000 : null
      })

      if (retryAfterSeconds !== null) {
        throw new AuthRateLimitError(retryAfterSeconds)
      }
    },

    async clear(action: AuthAction, fingerprint: string, identifier?: string) {
      const key = createRateLimitKey(action, fingerprint, identifier)
      await db.delete(authRateLimits).where(eq(authRateLimits.key, key))
    },
  }
}

const authRateLimiter = createAuthRateLimiter(database)

export const consumeAuthAttempt = authRateLimiter.consume
export const clearAuthAttempts = authRateLimiter.clear
