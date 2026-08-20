import { z } from 'zod'

const email = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email('Informe um e-mail válido.').max(254, 'O e-mail é muito longo.'))

export const loginSchema = z.object({
  email,
  password: z
    .string()
    .min(8, 'A senha precisa ter ao menos 8 caracteres.')
    .max(128, 'A senha precisa ter no máximo 128 caracteres.'),
})

export const registerSchema = loginSchema.extend({
  displayName: z
    .string()
    .trim()
    .min(2, 'Informe seu nome.')
    .max(50, 'Use no máximo 50 caracteres.'),
})

// TanStack Form keeps one stable shape while the visible fields change by mode.
export const loginFormSchema = loginSchema.extend({ displayName: z.string() })

export type LoginInput = z.input<typeof loginSchema>
export type RegisterInput = z.input<typeof registerSchema>
