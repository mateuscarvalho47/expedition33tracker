// @vitest-environment node

import { describe, expect, it } from 'vitest'

import { hashPassword, verifyPassword } from './password.server'

describe('armazenamento de senhas', () => {
  it('gera e verifica hashes Argon2id', async () => {
    const passwordHash = await hashPassword('painted-world')

    expect(passwordHash).toMatch(/^\$argon2id\$/)
    expect(await verifyPassword(passwordHash, 'painted-world')).toBe(true)
    expect(await verifyPassword(passwordHash, 'outra-senha')).toBe(false)
  })
})
