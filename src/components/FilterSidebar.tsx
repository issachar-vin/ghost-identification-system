import type {
  EvidenceType, EvidenceFilters, InteractionDefinition,
  InteractionFilters, EvidenceId,
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
  onClose?: () => void
  matchCount: number
  totalCount: number
  /** When true, sidebar renders as a slide-in overlay (mobile) */
  mobileOpen?: boolean
}

export function FilterSidebar({
  evidenceTypes, evidenceFilters, includeCount, interactionDefs,
  interactionFilters, onCycleEvidence, onSetInteraction, onReset,
  onClose, matchCount, totalCount, mobileOpen,
}: Props) {
  const isMobileOverlay = mobileOpen !== undefined
  const hasActiveFilters =
    Object.values(evidenceFilters).some((s) => s !== 'off') ||
    Object.values(interactionFilters).some((v) => v !== null)

  return (
    <aside style={{
      width: isMobileOverlay ? 'min(85%, 300px)' : 260,
      minWidth: isMobileOverlay ? undefined : 260,
      height: '100%',
      position: isMobileOverlay ? 'absolute' : 'relative',
      top: 0,
      left: 0,
      bottom: 0,
      display: 'flex',
      flexDirection: 'column',
      background: 'rgba(8, 12, 16, 0.72)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderRight: `1px solid rgba(79, 195, 247, 0.08)`,
      overflow: 'hidden',
      zIndex: isMobileOverlay ? 50 : 10,
      transform: isMobileOverlay
        ? `translateX(${mobileOpen ? '0' : '-100%'})`
        : undefined,
      transition: isMobileOverlay ? 'transform 0.28s cubic-bezier(0.4,0,0.2,1)' : undefined,
    }}>

      {/* Header */}
      <div style={{ padding: '20px 18px 16px', borderBottom: `1px solid rgba(79, 195, 247, 0.07)`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
        <div style={{
          fontFamily: colors.font.display,
          fontSize: '11px',
          letterSpacing: '0.2em',
          color: colors.text.secondary,
          textTransform: 'uppercase',
          marginBottom: 4,
        }}>
          Ghost Journal
        </div>
        <div style={{
          fontFamily: colors.font.mono,
          fontSize: 22,
          color: colors.accent.blue,
          lineHeight: 1,
          animation: 'countFlicker 9s infinite',
        }}>
          {matchCount}<span style={{ fontSize: 12, color: colors.text.secondary }}> / {totalCount} visible</span>
        </div>
        </div>
        {isMobileOverlay && onClose && (
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: colors.text.muted, fontSize: 20, lineHeight: 1, padding: 4, marginTop: 2 }}>
            ✕
          </button>
        )}
      </div>

      {/* Scrollable filters */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 18px 0' }}>

        {/* Evidence */}
        <div style={sectionTitleStyle}>Evidence</div>
        <div style={{ marginBottom: 4 }}>
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

        {/* Behaviors */}
        <div style={{ ...sectionTitleStyle, marginTop: 16 }}>Behaviors</div>
        {interactionDefs.map((def) => {
          const val = interactionFilters[def.id] ?? null
          if (def.filterType === 'toggle') {
            return (
              <ToggleFilter key={def.id} definition={def} value={val as boolean | null}
                onChange={(v) => onSetInteraction(def.id, v)} />
            )
          }
          return (
            <CategoryFilter key={def.id} definition={def} value={val as string | null}
              onChange={(v) => onSetInteraction(def.id, v)} />
          )
        })}
      </div>

      {/* Hint */}
      <div style={{
        padding: '10px 18px 12px',
        fontFamily: colors.font.mono,
        fontSize: 9,
        color: colors.text.muted,
        lineHeight: 1.7,
        borderTop: `1px solid rgba(79, 195, 247, 0.07)`,
      }}>
        CLICK ONCE — confirmed<br />
        CLICK TWICE — ruled out<br />
        CLICK THRICE — reset
      </div>

      {/* Legend */}
      <div style={{ padding: '10px 18px 12px', borderTop: `1px solid rgba(79, 195, 247, 0.07)` }}>
        <div style={{ fontFamily: colors.font.display, fontSize: 9, letterSpacing: '0.2em', color: colors.text.muted, textTransform: 'uppercase', marginBottom: 8 }}>Key</div>
        {[
          { color: colors.accent.green, label: 'Evidence confirmed' },
          { color: colors.accent.red,   label: 'Evidence ruled out' },
          { color: colors.text.muted,   label: 'Not selected' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: colors.font.mono, fontSize: 10, color: colors.text.muted, marginBottom: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
            {label}
          </div>
        ))}
      </div>

      {/* Reset */}
      {hasActiveFilters && (
        <button
          onClick={onReset}
          style={{
            display: 'block',
            width: 'calc(100% - 36px)',
            margin: '0 18px 16px',
            padding: '8px',
            background: 'transparent',
            border: `1px solid ${colors.text.muted}`,
            color: colors.text.muted,
            fontFamily: colors.font.mono,
            fontSize: 10,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            borderRadius: 4,
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            const b = e.currentTarget
            b.style.borderColor = colors.accent.blue
            b.style.color = colors.accent.blue
            b.style.boxShadow = '0 0 10px rgba(79,195,247,0.2)'
          }}
          onMouseLeave={(e) => {
            const b = e.currentTarget
            b.style.borderColor = colors.text.muted
            b.style.color = colors.text.muted
            b.style.boxShadow = 'none'
          }}
        >
          ⟳ Clear all filters
        </button>
      )}
    </aside>
  )
}

const sectionTitleStyle: React.CSSProperties = {
  fontFamily: "'Special Elite', serif",
  fontSize: 10,
  letterSpacing: '0.25em',
  color: '#3a5060',
  textTransform: 'uppercase',
  marginBottom: 12,
}
