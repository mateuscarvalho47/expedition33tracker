import { createServerFn } from '@tanstack/react-start'

import { database } from '~/db/client.server'
import { authMiddleware } from '~/features/auth/auth.functions'

import { getCollectibles } from './collectibles'
import { createProgressRepository } from './progress.repository.server'
import {
  bulkProgressSchema,
  replaceProgressSchema,
  updateProgressSchema,
} from './progress.schemas'

function getProgressRepository() {
  return createProgressRepository(database)
}

export const getProgressFn = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(({ context }) => getProgressRepository().listCompletedIds(context.user.id))

export const updateProgressFn = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(updateProgressSchema)
  .handler(async ({ context, data }) => {
    await getProgressRepository().setCompleted(
      context.user.id,
      data.collectibleId,
      data.completed,
    )
    return { ok: true }
  })

export const bulkProgressFn = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(bulkProgressSchema)
  .handler(async ({ context, data }) => {
    const ids = getCollectibles(data.tracker).map((item) => item.id)
    await getProgressRepository().setMany(context.user.id, ids, data.completed)
    return { ok: true }
  })

export const replaceProgressFn = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(replaceProgressSchema)
  .handler(async ({ context, data }) => {
    await getProgressRepository().replaceAll(context.user.id, data.completedIds)
    return { ok: true, completedIds: data.completedIds }
  })
