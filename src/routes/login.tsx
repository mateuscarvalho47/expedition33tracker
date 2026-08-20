import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { getViewerFn, loginFn, registerFn } from '~/features/auth/auth.functions'
import { AuthCard } from '~/features/auth/components/AuthCard'

export const Route = createFileRoute('/login')({
  beforeLoad: async () => {
    const viewer = await getViewerFn()
    if (viewer) throw redirect({ to: '/' })
  },
  component: LoginRoute,
})

function LoginRoute() {
  const navigate = useNavigate()

  return (
    <AuthCard
      onLogin={(input) => loginFn({ data: input })}
      onRegister={(input) => registerFn({ data: input })}
      onAuthenticated={() => navigate({ to: '/' })}
      onExploreDemo={() => navigate({ to: '/demo' })}
    />
  )
}
