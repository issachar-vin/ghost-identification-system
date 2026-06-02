import type { EvidenceId } from './ghost'

export type EvidenceFilterState = 'off' | 'include' | 'exclude'

export type EvidenceFilters = Record<EvidenceId, EvidenceFilterState>

export type InteractionFilters = Record<string, boolean | string | null>

export const EVIDENCE_IDS: EvidenceId[] = [
  'emf5',
  'spiritBox',
  'ultraviolet',
  'ghostWriting',
  'ghostOrb',
  'freezingTemps',
  'dotsProjector',
]

export const MAX_INCLUDE_COUNT = 3

export function makeDefaultEvidenceFilters(): EvidenceFilters {
  return {
    emf5: 'off',
    spiritBox: 'off',
    ultraviolet: 'off',
    ghostWriting: 'off',
    ghostOrb: 'off',
    freezingTemps: 'off',
    dotsProjector: 'off',
  }
}
