import { describe, expect, it } from 'vitest'

import { loginSchema, registerSchema } from './auth.schemas'

describe('contratos de autenticação', () => {
  it('normaliza o e-mail antes de atravessar a fronteira do servidor', () => {
    const result = loginSchema.parse({
      email: '  LUNE@EXPEDITION.FR ',
      password: 'painted-world',
    })

    expect(result.email).toBe('lune@expedition.fr')
  })

  it('rejeita senha curta', () => {
    const result = loginSchema.safeParse({ email: 'lune@example.com', password: '123' })
    expect(result.success).toBe(false)
  })

  it('exige nome ao criar conta', () => {
    const result = registerSchema.safeParse({
      displayName: ' ',
      email: 'lune@example.com',
      password: 'painted-world',
    })
    expect(result.success).toBe(false)
  })
})
