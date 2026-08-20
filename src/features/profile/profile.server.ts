import { and, eq } from 'drizzle-orm'

import { database } from '~/db/client.server'
import { userProgress, users } from '~/db/schema'

export type PublicProfile = {
  displayName: string
  profileSlug: string
  completedIds: string[]
}

export async function findPublicProfile(slug: string): Promise<PublicProfile | null> {
  const user = await database.query.users.findFirst({
    where: and(eq(users.profileSlug, slug), eq(users.isPublic, true)),
    columns: {
      id: true,
      displayName: true,
      profileSlug: true,
    },
  })
  if (!user) return null

  const progress = await database
    .select({ collectibleId: userProgress.collectibleId })
    .from(userProgress)
    .where(eq(userProgress.userId, user.id))

  return {
    displayName: user.displayName,
    profileSlug: user.profileSlug,
    completedIds: progress.map((row) => row.collectibleId),
  }
}

export async function updateProfileVisibility(userId: string, isPublic: boolean) {
  const [user] = await database
    .update(users)
    .set({ isPublic })
    .where(eq(users.id, userId))
    .returning({ isPublic: users.isPublic, profileSlug: users.profileSlug })

  return user
}
