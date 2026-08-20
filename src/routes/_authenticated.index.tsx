import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'

import { logoutFn } from '~/features/auth/auth.functions'
import { ProgressTracker } from '~/features/progress/components/ProgressTracker'
import { progressQueryOptions } from '~/features/progress/progress.queries'

export const Route = createFileRoute('/_authenticated/')({
  loader: ({ context }) => context.queryClient.ensureQueryData(progressQueryOptions),
  component: ChecklistRoute,
})

function ChecklistRoute() {
  const { user } = Route.useRouteContext()
  const router = useRouter()
  const navigate = useNavigate()

  return (
    <ProgressTracker
      viewer={user}
      onLogout={async () => {
        await logoutFn()
        router.options.context.queryClient.clear()
        await router.invalidate({ sync: true })
        await navigate({ to: '/login' })
      }}
    />
  )
}
