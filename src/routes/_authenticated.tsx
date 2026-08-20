import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { getViewerFn } from '~/features/auth/auth.functions'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    const user = await getViewerFn()
    if (!user) throw redirect({ to: '/login' })
    return { user }
  },
  component: Outlet,
})
