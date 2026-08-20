import { z } from 'zod'

export const profileSlugSchema = z.object({
  slug: z
    .string()
    .min(3)
    .max(48)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Perfil inválido.'),
})

export const updateProfileVisibilitySchema = z.object({
  isPublic: z.boolean(),
})
