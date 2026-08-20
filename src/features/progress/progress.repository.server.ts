import { and, eq, inArray } from 'drizzle-orm'

import type { DatabaseClient } from '~/db/client.server'
import { userProgress } from '~/db/schema'

export function createProgressRepository(db: DatabaseClient) {
  return {
    async listCompletedIds(userId: string): Promise<string[]> {
      const rows = await db
        .select({ collectibleId: userProgress.collectibleId })
        .from(userProgress)
        .where(eq(userProgress.userId, userId))

      return rows.map((row) => row.collectibleId)
    },

    async setCompleted(userId: string, collectibleId: string, completed: boolean) {
      if (completed) {
        await db
          .insert(userProgress)
          .values({ userId, collectibleId, completedAt: new Date() })
          .onConflictDoUpdate({
            target: [userProgress.userId, userProgress.collectibleId],
            set: { completedAt: new Date() },
          })
        return
      }

      await db
        .delete(userProgress)
        .where(
          and(
            eq(userProgress.userId, userId),
            eq(userProgress.collectibleId, collectibleId),
          ),
        )
    },

    async setMany(userId: string, collectibleIds: readonly string[], completed: boolean) {
      if (collectibleIds.length === 0) return

      await db.transaction(async (transaction) => {
        await transaction
          .delete(userProgress)
          .where(
            and(
              eq(userProgress.userId, userId),
              inArray(userProgress.collectibleId, [...collectibleIds]),
            ),
          )

        if (completed) {
          const now = new Date()
          await transaction.insert(userProgress).values(
            collectibleIds.map((collectibleId) => ({
              userId,
              collectibleId,
              completedAt: now,
            })),
          )
        }
      })
    },

    async replaceAll(userId: string, collectibleIds: readonly string[]) {
      await db.transaction(async (transaction) => {
        await transaction.delete(userProgress).where(eq(userProgress.userId, userId))

        if (collectibleIds.length > 0) {
          const completedAt = new Date()
          await transaction.insert(userProgress).values(
            collectibleIds.map((collectibleId) => ({
              userId,
              collectibleId,
              completedAt,
            })),
          )
        }
      })
    },
  }
}
