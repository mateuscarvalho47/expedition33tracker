import { describe, expect, it } from 'vitest'

import { createProgressExport, parseProgressImport } from './progress-transfer'

describe('transferência de progresso', () => {
  it('exporta e importa somente identificadores conhecidos', () => {
    const exported = createProgressExport(['childrenoflumiere', 'goblu'])
    const imported = parseProgressImport(JSON.stringify(exported))

    expect(imported.completedIds).toEqual(['childrenoflumiere', 'goblu'])
  })

  it('rejeita arquivos adulterados', () => {
    expect(() =>
      parseProgressImport(
        JSON.stringify({
          version: 1,
          exportedAt: new Date().toISOString(),
          completedIds: ['item-inexistente'],
        }),
      ),
    ).toThrow('Colecionável desconhecido')
  })
})
