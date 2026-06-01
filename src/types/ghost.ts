export type EvidenceId =
  | 'emf5'
  | 'spiritBox'
  | 'ultraviolet'
  | 'ghostWriting'
  | 'ghostOrb'
  | 'freezingTemps'
  | 'dotsProjector'

export type BehaviorCategory =
  | 'hunt'
  | 'evidence'
  | 'environment'
  | 'sanity'
  | 'equipment'
  | 'general'

export type IdentifyValue = 'high' | 'medium' | 'low'

export interface UniqueBehavior {
  description: string
  category: BehaviorCategory
  identifyValue: IdentifyValue
}

export interface EvidenceType {
  id: EvidenceId
  name: string
  description: string
  equipment: string
}

export interface Ghost {
  id: string
  name: string
  evidence: EvidenceId[]
  fakeEvidence?: EvidenceId[]
  strength: string
  weakness: string
  huntSanityThreshold: number
  huntSanityThresholdNotes?: string
  uniqueBehaviors: UniqueBehavior[]
  identifyingClues: string[]
}

export interface GhostData {
  meta: {
    game: string
    version: string
    lastUpdated: string
    totalGhosts: number
    notes: string
  }
  evidenceTypes: EvidenceType[]
  ghosts: Ghost[]
}
