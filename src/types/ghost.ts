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
  shortName: string
  description: string
  equipment: string
}

export interface ToggleInteraction {
  id: string
  label: string
  description: string
  filterType: 'toggle'
  defaultValue: boolean
  trueLabel: string
  falseLabel: string
}

export interface CategoryOption {
  value: string
  label: string
  description: string
}

export interface CategoryInteraction {
  id: string
  label: string
  description: string
  filterType: 'category'
  defaultValue: string
  options: CategoryOption[]
}

export type InteractionDefinition = ToggleInteraction | CategoryInteraction

export type GhostInteractionOverrides = Record<string, boolean | string>

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
  interactions: GhostInteractionOverrides
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
  interactions: InteractionDefinition[]
  ghosts: Ghost[]
}
