import { useState } from 'react'
import type { Ghost, GhostData } from './types'
import { useGhostFilter } from './hooks/useGhostFilter'
import { colors } from './theme'
import { FilterSidebar } from './components/FilterSidebar'
import { GhostCard } from './components/GhostCard'
import { GhostModal } from './components/GhostModal'
import { GhostBackground } from './components/GhostBackground'
import ghostData from './data/ghosts.json'
import './styles/animations.css'

const data = ghostData as unknown as GhostData

export default function App() {
  const [selectedGhost, setSelectedGhost] = useState<Ghost | null>(null)

  const {
    evidenceFilters,
    cycleEvidence,
    includeCount,
    interactionFilters,
    setInteractionFilter,
    filteredGhosts,
    reset,
  } = useGhostFilter(data.ghosts, data.interactions)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative', zIndex: 2 }}>
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

      <main
        style={{
          flex: 1,
          padding: '24px',
          overflowY: 'auto',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <header style={{ marginBottom: '20px' }}>
          <h2
            style={{
              fontSize: '13px',
              fontFamily: "'Courier New', monospace",
              color: colors.text.muted,
              fontWeight: 400,
              animation: 'flicker-dim 8s ease-in-out infinite',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            [{filteredGhosts.length} of {data.ghosts.length} entities detected]
          </h2>
        </header>

        {filteredGhosts.length === 0 ? (
          <EmptyState onReset={reset} />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '14px',
            }}
          >
            {filteredGhosts.map((ghost) => (
              <GhostCard
                key={ghost.id}
                ghost={ghost}
                evidenceTypes={data.evidenceTypes}
                interactionDefs={data.interactions}
                onClick={() => setSelectedGhost(ghost)}
              />
            ))}
          </div>
        )}
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '60vh',
        gap: '16px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontSize: '48px',
          animation: 'flicker 6s ease-in-out infinite',
          filter: 'drop-shadow(0 0 12px rgba(57,255,20,0.3))',
        }}
      >
        👻
      </div>
      <p
        style={{
          fontSize: '14px',
          color: colors.text.muted,
          fontFamily: 'monospace',
          letterSpacing: '0.05em',
        }}
      >
        No entities match the current evidence
      </p>
      <button
        onClick={onReset}
        style={{
          fontSize: '12px',
          fontWeight: 600,
          padding: '8px 16px',
          borderRadius: '6px',
          border: `1px solid ${colors.border.medium}`,
          background: 'transparent',
          color: colors.text.secondary,
          cursor: 'pointer',
          fontFamily: 'monospace',
          letterSpacing: '0.05em',
        }}
      >
        [ Clear filters ]
      </button>
    </div>
  )
}
