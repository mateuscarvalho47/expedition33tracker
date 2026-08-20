import { describe, expect, it } from 'vitest'

import {
  ALL_COLLECTIBLE_IDS,
  getCollectibles,
  isCollectibleId,
  TRACKERS,
} from './collectibles'

describe('catálogo de colecionáveis', () => {
  it('preserva os 33 discos e 49 diários do protótipo', () => {
    expect(getCollectibles('records')).toHaveLength(33)
    expect(getCollectibles('journals')).toHaveLength(49)
  })

  it('mantém identificadores globais únicos para a persistência', () => {
    expect(new Set(ALL_COLLECTIBLE_IDS).size).toBe(82)
  })

  it('reconhece apenas identificadores pertencentes ao catálogo', () => {
    expect(isCollectibleId('lumiere')).toBe(true)
    expect(isCollectibleId('item-injetado-pelo-cliente')).toBe(false)
  })

  it('mantém totais de categoria consistentes com o tracker', () => {
    for (const tracker of Object.values(TRACKERS)) {
      const total = tracker.categories.reduce(
        (sum, category) => sum + category.items.length,
        0,
      )
      expect(total).toBeGreaterThan(0)
    }
  })

  it('mantém descrições de localização acionáveis e sem atalhos vagos', () => {
    const vagueDescriptions =
      /\b(no meio da área|perto de corpos|entre duas tendas|lado direito da área)\b/i

    for (const tracker of Object.keys(TRACKERS) as Array<keyof typeof TRACKERS>) {
      for (const item of getCollectibles(tracker)) {
        expect(item.location, item.id).toMatch(/—/)
        expect(item.location, item.id).toMatch(/\.$/)
        expect(item.location.length, item.id).toBeGreaterThanOrEqual(70)
        expect(item.location, item.id).not.toMatch(vagueDescriptions)
      }
    }
  })
})
