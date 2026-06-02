import { useMemo, useState } from 'react'
import type { Ghost, GhostData, EvidenceFilters } from './types'
import { useGhostFilter } from './hooks/useGhostFilter'
import { colors } from './theme'
import { FilterSidebar } from './components/FilterSidebar'
import { GhostCard } from './components/GhostCard'
import { GhostModal } from './components/GhostModal'
import { GhostBackground } from './components/GhostBackground'
import { StaticCanvas } from './components/StaticCanvas'
import ghostData from './data/ghosts.json'
import './styles/animations.css'

const data = ghostData as unknown as GhostData

type CardStatus = 'normal' | 'possible' | 'confirmed'

function getCardStatus(ghost: Ghost, evidenceFilters: EvidenceFilters, includeCount: number, isVisible: boolean): CardStatus {
  if (!isVisible) return 'normal'
  if (includeCount === 3) return 'confirmed'
  if (includeCount > 0) return 'possible'
  return 'normal'
}

export default function App() {
  const [selectedGhost, setSelectedGhost] = useState<Ghost | null>(null)

  const {
    evidenceFilters, cycleEvidence, includeCount,
    interactionFilters, setInteractionFilter,
    filteredGhosts, reset,
  } = useGhostFilter(data.ghosts, data.interactions)

  const visibleIds = useMemo(
    () => new Set(filteredGhosts.map((g) => g.id)),
    [filteredGhosts]
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
      <StaticCanvas />
      <GhostBackground />

      <FilterSidebar
        evidenceTypes={data.evidenceTypes}
        evidenceFilters={evidenceFilters}
        includeCount={includeCount}
        interactionDefs={data.interactions}
        interactionFilters={interactionFilters}
        onCycleEvidence={cycleEvidence}
        onSetInteraction={setInteractionFilter}
        onReset={reset}
        matchCount={filteredGhosts.length}
        totalCount={data.ghosts.length}
      />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', zIndex: 2 }}>
        {/* PHASMOPHOBIA header */}
        <div style={{
          padding: '28px 32px 20px',
          borderBottom: `1px solid ${colors.border.panel}`,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, rgba(79,195,247,0.03) 0%, transparent 60%)',
          }} />
          <div style={{
            fontFamily: colors.font.display,
            fontSize: 32,
            letterSpacing: '0.08em',
            color: colors.accent.blue,
            textShadow: '0 0 20px rgba(79,195,247,0.5), 0 0 60px rgba(79,195,247,0.2)',
            lineHeight: 1,
            marginBottom: 4,
            animation: 'titleFlicker 8s infinite',
            position: 'relative',
          }}>
            PHASMOPHOBIA
          </div>
          <div style={{
            fontFamily: colors.font.mono,
            fontSize: 11,
            color: colors.text.muted,
            letterSpacing: '0.2em',
            position: 'relative',
          }}>
            — GHOST FIELD REFERENCE — v{data.meta.version} —
          </div>
        </div>

        {/* Grid */}
        <div style={{
          padding: '24px 28px',
          overflowY: 'auto',
          flex: 1,
        }}>
          {filteredGhosts.length === 0 ? (
            <EmptyState onReset={reset} />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
              {data.ghosts.map((ghost) => {
                const isVisible = visibleIds.has(ghost.id)
                return (
                  <GhostCard
                    key={ghost.id}
                    ghost={ghost}
                    evidenceTypes={data.evidenceTypes}
                    evidenceFilters={evidenceFilters}
                    interactionDefs={data.interactions}
                    status={getCardStatus(ghost, evidenceFilters, includeCount, isVisible)}
                    visible={isVisible}
                    onClick={() => isVisible && setSelectedGhost(ghost)}
                  />
                )
              })}
            </div>
          )}
        </div>
      </main>

      <GhostModal
        ghost={selectedGhost}
        evidenceTypes={data.evidenceTypes}
        interactionDefs={data.interactions}
        onClose={() => setSelectedGhost(null)}
      />
    </div>
  )
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 16, textAlign: 'center' }}>
      <div style={{ fontFamily: colors.font.display, fontSize: 24, color: colors.text.muted, letterSpacing: '0.1em' }}>
        No entities detected
        <div style={{ fontFamily: colors.font.mono, fontSize: 12, marginTop: 8, color: colors.text.muted }}>
          No ghosts match the current evidence
        </div>
      </div>
      <button
        onClick={onReset}
        style={{
          fontFamily: colors.font.mono,
          fontSize: 10,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          padding: '8px 16px',
          border: `1px solid ${colors.text.muted}`,
          background: 'transparent',
          color: colors.text.muted,
          borderRadius: 4,
          cursor: 'crosshair',
        }}
      >
        ⟳ Clear all filters
      </button>
    </div>
  )
}
