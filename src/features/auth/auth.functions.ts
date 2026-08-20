import { createMiddleware, createServerFn } from '@tanstack/react-start'
import { getRequestHeader } from '@tanstack/react-start/server'

import { loginSchema, registerSchema } from './auth.schemas'
import { getViewer, login, logout, register, requireViewer } from './auth.server'

function getClientFingerprint() {
  const forwardedFor = getRequestHeader('x-forwarded-for')
  const realIp = getRequestHeader('x-real-ip')
  return forwardedFor?.split(',')[0]?.trim() || realIp || 'unknown-client'
}

export const authMiddleware = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    const user = await requireViewer()
    return next({ context: { user } })
  },
)

export const getViewerFn = createServerFn({ method: 'GET' }).handler(() => getViewer())

export const loginFn = createServerFn({ method: 'POST' })
  .validator(loginSchema)
  .handler(({ data }) => login(data, getClientFingerprint()))

export const registerFn = createServerFn({ method: 'POST' })
  .validator(registerSchema)
  .handler(({ data }) => register(data, getClientFingerprint()))

export const logoutFn = createServerFn({ method: 'POST' }).handler(() => logout())
