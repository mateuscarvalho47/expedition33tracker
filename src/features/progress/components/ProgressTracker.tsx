import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { useRef, useState } from 'react'

import type { Viewer } from '~/features/auth/auth.types'
import { updateProfileVisibilityFn } from '~/features/profile/profile.functions'

import {
  bulkProgressFn,
  replaceProgressFn,
  updateProgressFn,
} from '../progress.functions'
import {
  applyBulkProgressUpdate,
  applyProgressUpdate,
  progressQueryKey,
  progressQueryOptions,
} from '../progress.queries'
import type {
  BulkProgressInput,
  ReplaceProgressInput,
  UpdateProgressInput,
} from '../progress.schemas'
import { type SaveStatus, TrackerPage } from './TrackerPage'

type ProgressTrackerProps = {
  viewer: Viewer
  onLogout: () => Promise<void>
  updateProgress?: (input: UpdateProgressInput) => Promise<unknown>
  bulkProgress?: (input: BulkProgressInput) => Promise<unknown>
  replaceProgress?: (input: ReplaceProgressInput) => Promise<unknown>
  updateVisibility?: (isPublic: boolean) => Promise<unknown>
}

export function ProgressTracker({
  viewer,
  onLogout,
  updateProgress = (input) => updateProgressFn({ data: input }),
  bulkProgress = (input) => bulkProgressFn({ data: input }),
  replaceProgress = (input) => replaceProgressFn({ data: input }),
  updateVisibility = (isPublic) => updateProfileVisibilityFn({ data: { isPublic } }),
}: ProgressTrackerProps) {
  const queryClient = useQueryClient()
  const { data: completedIds } = useSuspenseQuery(progressQueryOptions)
  const [pendingIds, setPendingIds] = useState(() => new Set<string>())
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [isPublic, setIsPublic] = useState(viewer.isPublic)
  const statusTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  function announce(status: SaveStatus) {
    if (statusTimer.current) clearTimeout(statusTimer.current)
    setSaveStatus(status)

    if (status === 'saved') {
      statusTimer.current = setTimeout(() => setSaveStatus('idle'), 1400)
    }
  }

  const updateMutation = useMutation({
    mutationKey: ['progress', 'update'],
    mutationFn: (input: UpdateProgressInput) => updateProgress(input),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: progressQueryKey })
      setPendingIds((current) => new Set(current).add(input.collectibleId))
      queryClient.setQueryData<string[]>(progressQueryKey, (current) =>
        applyProgressUpdate(current, input),
      )
      announce('saving')
    },
    onError: (_error, input) => {
      queryClient.setQueryData<string[]>(progressQueryKey, (current) =>
        applyProgressUpdate(current, { ...input, completed: !input.completed }),
      )
      announce('error')
    },
    onSuccess: () => announce('saved'),
    onSettled: (_data, _error, input) => {
      setPendingIds((current) => {
        const next = new Set(current)
        next.delete(input.collectibleId)
        return next
      })
    },
  })

  const bulkMutation = useMutation({
    mutationKey: ['progress', 'bulk'],
    mutationFn: (input: BulkProgressInput) => bulkProgress(input),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: progressQueryKey })
      const previous = queryClient.getQueryData<string[]>(progressQueryKey) ?? []
      queryClient.setQueryData<string[]>(progressQueryKey, (current) =>
        applyBulkProgressUpdate(current, input),
      )
      announce('saving')
      return { previous }
    },
    onError: (_error, _input, context) => {
      queryClient.setQueryData(progressQueryKey, context?.previous ?? [])
      announce('error')
    },
    onSuccess: () => announce('saved'),
  })

  const replaceMutation = useMutation({
    mutationKey: ['progress', 'replace'],
    mutationFn: (input: ReplaceProgressInput) => replaceProgress(input),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: progressQueryKey })
      const previous = queryClient.getQueryData<string[]>(progressQueryKey) ?? []
      queryClient.setQueryData(progressQueryKey, [...new Set(input.completedIds)])
      announce('saving')
      return { previous }
    },
    onError: (_error, _input, context) => {
      queryClient.setQueryData(progressQueryKey, context?.previous ?? [])
      announce('error')
    },
    onSuccess: () => announce('saved'),
  })

  const visibilityMutation = useMutation({
    mutationKey: ['profile', 'visibility'],
    mutationFn: (nextIsPublic: boolean) => updateVisibility(nextIsPublic),
    onMutate: (nextIsPublic) => {
      const previous = isPublic
      setIsPublic(nextIsPublic)
      return { previous }
    },
    onError: (_error, _input, context) => setIsPublic(context?.previous ?? false),
  })

  return (
    <TrackerPage
      viewer={viewer}
      completedIds={completedIds}
      pendingIds={pendingIds}
      bulkPending={
        bulkMutation.isPending || replaceMutation.isPending || pendingIds.size > 0
      }
      saveStatus={saveStatus}
      mode="authenticated"
      profileSlug={viewer.profileSlug}
      isPublic={isPublic}
      onUpdate={(input) => updateMutation.mutate(input)}
      onBulkUpdate={(input) => bulkMutation.mutate(input)}
      onReplaceProgress={(input) =>
        replaceMutation.mutateAsync(input).then(() => undefined)
      }
      onToggleVisibility={(nextIsPublic) => visibilityMutation.mutate(nextIsPublic)}
      onLogout={onLogout}
    />
  )
}
