import { hash, verify } from '@node-rs/argon2'

const argon2idOptions = {
  memoryCost: 19_456,
  timeCost: 2,
  parallelism: 1,
  outputLen: 32,
} as const

export function hashPassword(password: string) {
  return hash(password, argon2idOptions)
}

export async function verifyPassword(passwordHash: string, password: string) {
  try {
    return await verify(passwordHash, password)
  } catch {
    return false
  }
}
