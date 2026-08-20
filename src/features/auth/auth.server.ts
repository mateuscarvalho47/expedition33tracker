import { randomUUID } from 'node:crypto'

import { eq } from 'drizzle-orm'

import { database } from '~/db/client.server'
import { users } from '~/db/schema'

import type { LoginInput, RegisterInput } from './auth.schemas'
import { loginSchema, registerSchema } from './auth.schemas'
import type { AuthResult, Viewer } from './auth.types'
import { hashPassword, verifyPassword } from './password.server'
import {
  AuthRateLimitError,
  clearAuthAttempts,
  consumeAuthAttempt,
} from './rate-limit.server'
import { useAppSession } from './session.server'

function toViewer(user: typeof users.$inferSelect): Viewer {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    profileSlug: user.profileSlug,
    isPublic: user.isPublic,
  }
}

function createProfileSlug(displayName: string) {
  const normalizedName = displayName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 36)
  return `${normalizedName || 'expedicionario'}-${randomUUID().slice(0, 8)}`
}

function isUniqueViolation(error: unknown, constraint: string) {
  return (
    error instanceof Error &&
    'code' in error &&
    error.code === '23505' &&
    'constraint_name' in error &&
    error.constraint_name === constraint
  )
}

function rateLimitResult(error: unknown): AuthResult | undefined {
  if (!(error instanceof AuthRateLimitError)) return undefined
  const minutes = Math.max(1, Math.ceil(error.retryAfterSeconds / 60))
  return {
    ok: false,
    error: `Muitas tentativas. Tente novamente em ${minutes} min.`,
  }
}

async function findViewerById(id: string): Promise<Viewer | null> {
  const user = await database.query.users.findFirst({ where: eq(users.id, id) })
  return user ? toViewer(user) : null
}

export async function getViewer(): Promise<Viewer | null> {
  const session = await useAppSession()
  return session.data.userId ? findViewerById(session.data.userId) : null
}

export async function requireViewer(): Promise<Viewer> {
  const viewer = await getViewer()
  if (!viewer) throw new Error('UNAUTHORIZED')
  return viewer
}

export async function login(
  input: LoginInput,
  clientFingerprint = 'unknown-client',
): Promise<AuthResult> {
  const data = loginSchema.parse(input)
  try {
    await consumeAuthAttempt('login', clientFingerprint, data.email)
  } catch (error) {
    return rateLimitResult(error) ?? { ok: false, error: 'Não foi possível entrar.' }
  }

  const user = await database.query.users.findFirst({
    where: eq(users.email, data.email),
  })

  if (!user || !(await verifyPassword(user.passwordHash, data.password))) {
    return { ok: false, error: 'E-mail ou senha incorretos.' }
  }

  await clearAuthAttempts('login', clientFingerprint, data.email)

  const session = await useAppSession()
  await session.update({ userId: user.id })
  return { ok: true, user: toViewer(user) }
}

export async function register(
  input: RegisterInput,
  clientFingerprint = 'unknown-client',
): Promise<AuthResult> {
  const data = registerSchema.parse(input)
  try {
    await consumeAuthAttempt('register', clientFingerprint)
  } catch (error) {
    return (
      rateLimitResult(error) ?? { ok: false, error: 'Não foi possível criar a conta.' }
    )
  }

  let user: typeof users.$inferSelect
  try {
    ;[user] = await database
      .insert(users)
      .values({
        id: randomUUID(),
        email: data.email,
        displayName: data.displayName,
        profileSlug: createProfileSlug(data.displayName),
        passwordHash: await hashPassword(data.password),
      })
      .returning()
  } catch (error) {
    if (isUniqueViolation(error, 'users_email_unique')) {
      return { ok: false, error: 'Este e-mail já está cadastrado.', field: 'email' }
    }
    throw error
  }

  const session = await useAppSession()
  await session.update({ userId: user.id })
  return { ok: true, user: toViewer(user) }
}

export async function logout(): Promise<void> {
  const session = await useAppSession()
  await session.clear()
}
