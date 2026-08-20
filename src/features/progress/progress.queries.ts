import { queryOptions } from '@tanstack/react-query'

import { getCollectibles } from './collectibles'
import { getProgressFn } from './progress.functions'
import type { BulkProgressInput, UpdateProgressInput } from './progress.schemas'

export const progressQueryKey = ['progress'] as const

export const progressQueryOptions = queryOptions({
  queryKey: progressQueryKey,
  queryFn: () => getProgressFn(),
  staleTime: 30_000,
})

export function applyProgressUpdate(
  current: readonly string[] | undefined,
  input: UpdateProgressInput,
): string[] {
  const next = new Set(current ?? [])
  if (input.completed) next.add(input.collectibleId)
  else next.delete(input.collectibleId)
  return [...next]
}

export function applyBulkProgressUpdate(
  current: readonly string[] | undefined,
  input: BulkProgressInput,
): string[] {
  const next = new Set(current ?? [])
  const trackerIds = getCollectibles(input.tracker).map((item) => item.id)

  for (const id of trackerIds) {
    if (input.completed) next.add(id)
    else next.delete(id)
  }

  return [...next]
}
