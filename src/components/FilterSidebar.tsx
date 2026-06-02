import type {
  EvidenceType,
  EvidenceFilters,
  InteractionDefinition,
  InteractionFilters,
  EvidenceId,
} from '../types'
import { MAX_INCLUDE_COUNT } from '../types'
import { colors } from '../theme'
import { EvidenceFilterItem } from './EvidenceFilterItem'
import { ToggleFilter } from './ToggleFilter'
import { CategoryFilter } from './CategoryFilter'
import '../styles/animations.css'

interface Props {
  evidenceTypes: EvidenceType[]
  evidenceFilters: EvidenceFilters
  includeCount: number
  interactionDefs: InteractionDefinition[]
  interactionFilters: InteractionFilters
  onCycleEvidence: (id: EvidenceId) => void
  onSetInteraction: (id: string, value: boolean | string | null) => void
  onReset: () => void
  matchCount: number
  totalCount: number
}

export function FilterSidebar({
  evidenceTypes,
  evidenceFilters,
  includeCount,
  interactionDefs,
  interactionFilters,
  onCycleEvidence,
  onSetInteraction,
  onReset,
  matchCount,
  totalCount,
}: Props) {
  const hasActiveFilters =
    Object.values(evidenceFilters).some((s) => s !== 'off') ||
    Object.values(interactionFilters).some((v) => v !== null)

  return (
    <aside style={sidebarStyle}>
      {/* Header */}
      <div style={{ padding: '20px 16px 16px', borderBottom: `1px solid ${colors.border.subtle}` }}>
        <h1 style={{
          fontSize: '15px',
          fontWeight: 700,
          color: colors.text.accent,
          letterSpacing: '0.08em',
          marginBottom: '2px',
          fontFamily: "'Courier New', monospace",
          textTransform: 'uppercase',
          animation: 'flicker 12s ease-in-out infinite',
          textShadow: `0 0 10px rgba(57,255,20,0.35)`,
        }}>
          ☽ Ghost ID System
        </h1>
        <p style={{ fontSize: '10px', color: colors.text.muted, fontFamily: 'monospace', letterSpacing: '0.05em' }}>
          Phasmophobia · {totalCount} entities
        </p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px' }}>
        {/* Evidence section */}
        <section style={{ marginBottom: '20px' }}>
          <div style={sectionHeaderStyle}>
            <span>Evidence</span>
            <span style={{ fontSize: '11px', color: colors.text.muted, fontWeight: 400 }}>
              {includeCount}/{MAX_INCLUDE_COUNT} selected
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {evidenceTypes.map((et) => (
              <EvidenceFilterItem
                key={et.id}
                evidenceType={et}
                state={evidenceFilters[et.id]}
                onCycle={() => onCycleEvidence(et.id)}
                includeDisabled={includeCount >= MAX_INCLUDE_COUNT && evidenceFilters[et.id] === 'off'}
              />
            ))}
          </div>
        </section>

        {/* Interactions section */}
        <section>
          <div style={{ ...sectionHeaderStyle, marginBottom: '12px' }}>
            <span>Behaviors</span>
          </div>
          {interactionDefs.map((def) => {
            const currentValue = interactionFilters[def.id] ?? null
            if (def.filterType === 'toggle') {
              return (
                <ToggleFilter
                  key={def.id}
                  definition={def}
                  value={currentValue as boolean | null}
                  onChange={(v) => onSetInteraction(def.id, v)}
                />
              )
            }
            if (def.filterType === 'category') {
              return (
                <CategoryFilter
                  key={def.id}
                  definition={def}
                  value={currentValue as string | null}
                  onChange={(v) => onSetInteraction(def.id, v)}
                />
              )
            }
            return null
          })}
        </section>
      </div>

      {/* Footer */}
      <div style={{ padding: '12px 16px', borderTop: `1px solid ${colors.border.subtle}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '12px', color: colors.text.secondary }}>
          <strong style={{ color: colors.text.primary }}>{matchCount}</strong> match{matchCount !== 1 ? 'es' : ''}
        </span>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            style={{
              fontSize: '11px',
              fontWeight: 600,
              padding: '4px 10px',
              borderRadius: '5px',
              border: `1px solid ${colors.border.medium}`,
              background: 'transparent',
              color: colors.text.secondary,
              cursor: 'pointer',
            }}
          >
            Reset
          </button>
        )}
      </div>
    </aside>
  )
}

const sidebarStyle: React.CSSProperties = {
  width: '300px',
  minWidth: '300px',
  height: '100vh',
  position: 'sticky',
  top: 0,
  display: 'flex',
  flexDirection: 'column',
  background: colors.background.secondary,
  borderRight: `1px solid ${colors.border.medium}`,
  overflow: 'hidden',
  zIndex: 10,
  boxShadow: `2px 0 20px rgba(0,0,0,0.4), inset -1px 0 0 rgba(57,255,20,0.05)`,
}

const sectionHeaderStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 700,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.08em',
  color: colors.text.secondary,
  marginBottom: '8px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}
