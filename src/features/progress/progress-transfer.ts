import { progressExportSchema } from './progress.schemas'

export function createProgressExport(completedIds: readonly string[]) {
  return progressExportSchema.parse({
    version: 1,
    exportedAt: new Date().toISOString(),
    completedIds,
  })
}

export function parseProgressImport(contents: string) {
  return progressExportSchema.parse(JSON.parse(contents))
}
