import { z } from 'zod'

const productionEnvironmentSchema = z.object({
  DATABASE_URL: z
    .url('DATABASE_URL precisa ser uma URL PostgreSQL válida.')
    .refine(
      (url) => url.startsWith('postgres://') || url.startsWith('postgresql://'),
      'DATABASE_URL precisa usar o protocolo postgres ou postgresql.',
    ),
  SESSION_SECRET: z
    .string()
    .min(32, 'SESSION_SECRET precisa ter pelo menos 32 caracteres.'),
})

const result = productionEnvironmentSchema.safeParse(process.env)

if (!result.success) {
  console.error('Configuração de produção inválida:')
  for (const issue of result.error.issues) console.error(`- ${issue.message}`)
  process.exit(1)
}
