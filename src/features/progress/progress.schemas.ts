import { z } from 'zod'

import { isCollectibleId } from './collectibles'

export const updateProgressSchema = z.object({
  collectibleId: z.string().refine(isCollectibleId, 'Colecionável desconhecido.'),
  completed: z.boolean(),
})

export const bulkProgressSchema = z.object({
  tracker: z.enum(['records', 'journals']),
  completed: z.boolean(),
})

export const replaceProgressSchema = z.object({
  completedIds: z
    .array(z.string().refine(isCollectibleId, 'Colecionável desconhecido.'))
    .max(82, 'O arquivo possui itens demais.')
    .transform((ids) => [...new Set(ids)]),
})

export const progressExportSchema = z.object({
  version: z.literal(1),
  exportedAt: z.iso.datetime(),
  completedIds: replaceProgressSchema.shape.completedIds,
})

export type UpdateProgressInput = z.infer<typeof updateProgressSchema>
export type BulkProgressInput = z.infer<typeof bulkProgressSchema>
export type ReplaceProgressInput = z.input<typeof replaceProgressSchema>
