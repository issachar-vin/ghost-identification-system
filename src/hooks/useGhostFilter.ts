import { useMemo, useState } from 'react'
import type {
  Ghost,
  EvidenceId,
  InteractionDefinition,
  EvidenceFilters,
  EvidenceFilterState,
  InteractionFilters,
} from '../types'
import { makeDefaultEvidenceFilters, MAX_INCLUDE_COUNT } from '../types'

function resolveGhostInteractionValue(
  ghost: Ghost,
  definition: InteractionDefinition
): boolean | string {
  if (definition.id in ghost.interactions) {
    return ghost.interactions[definition.id]
  }
  return definition.defaultValue
}

export function useGhostFilter(ghosts: Ghost[], interactionDefs: InteractionDefinition[]) {
  const [evidenceFilters, setEvidenceFilters] = useState<EvidenceFilters>(
    makeDefaultEvidenceFilters
  )
  const [interactionFilters, setInteractionFilters] = useState<InteractionFilters>({})

  const includeCount = useMemo(
    () => Object.values(evidenceFilters).filter((s) => s === 'include').length,
    [evidenceFilters]
  )

  function cycleEvidence(id: EvidenceId) {
    setEvidenceFilters((prev) => {
      const current = prev[id]
      const currentIncludeCount = Object.values(prev).filter((s) => s === 'include').length

      let next: EvidenceFilterState
      if (current === 'off') {
        next = currentIncludeCount < MAX_INCLUDE_COUNT ? 'include' : 'exclude'
      } else if (current === 'include') {
        next = 'exclude'
      } else {
        next = 'off'
      }

      return { ...prev, [id]: next }
    })
  }

  function setInteractionFilter(id: string, value: boolean | string | null) {
    setInteractionFilters((prev) => ({ ...prev, [id]: value }))
  }

  function reset() {
    setEvidenceFilters(makeDefaultEvidenceFilters())
    setInteractionFilters({})
  }

  const filteredGhosts = useMemo(() => {
    return ghosts.filter((ghost) => {
      // Evidence filters — AND across all non-off states
      for (const [evidenceId, state] of Object.entries(evidenceFilters)) {
        if (state === 'include' && !ghost.evidence.includes(evidenceId as EvidenceId)) {
          return false
        }
        if (state === 'exclude' && ghost.evidence.includes(evidenceId as EvidenceId)) {
          return false
        }
      }

      // Interaction filters — AND across all non-null values
      for (const [interactionId, filterValue] of Object.entries(interactionFilters)) {
        if (filterValue === null) continue

        const definition = interactionDefs.find((d) => d.id === interactionId)
        if (!definition) continue

        const ghostValue = resolveGhostInteractionValue(ghost, definition)
        if (ghostValue !== filterValue) return false
      }

      return true
    })
  }, [ghosts, evidenceFilters, interactionFilters, interactionDefs])

  return {
    evidenceFilters,
    cycleEvidence,
    includeCount,
    interactionFilters,
    setInteractionFilter,
    filteredGhosts,
    reset,
  }
}
