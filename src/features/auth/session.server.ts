import { useSession } from '@tanstack/react-start/server'

type SessionData = {
  userId?: string
}

const developmentSecret = 'expedition-33-development-secret-change-me'

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET

  if (secret) return secret
  if (process.env.NODE_ENV !== 'production') return developmentSecret

  throw new Error('SESSION_SECRET precisa ser configurada em produção.')
}

export function useAppSession() {
  return useSession<SessionData>({
    name: 'expedition-33-session',
    password: getSessionSecret(),
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    },
  })
}
