import { describe, expect, it } from 'vitest'

import { applyBulkProgressUpdate, applyProgressUpdate } from './progress.queries'

describe('cache de progresso', () => {
  it('adiciona e remove um item sem duplicá-lo', () => {
    const completed = applyProgressUpdate([], {
      collectibleId: 'lumiere',
      completed: true,
    })
    const repeated = applyProgressUpdate(completed, {
      collectibleId: 'lumiere',
      completed: true,
    })
    const cleared = applyProgressUpdate(repeated, {
      collectibleId: 'lumiere',
      completed: false,
    })

    expect(repeated).toEqual(['lumiere'])
    expect(cleared).toEqual([])
  })

  it('marca um tracker inteiro preservando o outro', () => {
    const completed = applyBulkProgressUpdate(['j-verso'], {
      tracker: 'records',
      completed: true,
    })

    expect(completed).toHaveLength(34)
    expect(completed).toContain('j-verso')
    expect(completed).toContain('childrenoflumiere')
  })

  it('limpa somente o tracker solicitado', () => {
    const completed = applyBulkProgressUpdate(['j-verso', 'lumiere'], {
      tracker: 'records',
      completed: false,
    })

    expect(completed).toEqual(['j-verso'])
  })
})
