import { useMemo, useState } from 'react'
import type { Ghost, GhostData } from './types'
import { useGhostFilter } from './hooks/useGhostFilter'
import { useIsMobile } from './hooks/useIsMobile'
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

function getCardStatus(_ghost: Ghost, includeCount: number, isVisible: boolean): CardStatus {
  if (!isVisible) return 'normal'
  if (includeCount === 3) return 'confirmed'
  if (includeCount > 0) return 'possible'
  return 'normal'
}

export default function App() {
  const [selectedGhost, setSelectedGhost] = useState<Ghost | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isMobile = useIsMobile()

  const {
    evidenceFilters, cycleEvidence, includeCount,
    interactionFilters, setInteractionFilter,
    filteredGhosts, reset,
  } = useGhostFilter(data.ghosts, data.interactions)

  const visibleIds = useMemo(
    () => new Set(filteredGhosts.map((g) => g.id)),
    [filteredGhosts]
  )

  const activeFilterCount =
    Object.values(evidenceFilters).filter((s) => s !== 'off').length +
    Object.values(interactionFilters).filter((v) => v !== null).length

  return (
    <>
      {/* TV static — full-screen, above everything */}
      <StaticCanvas />

      <div className="app-shell">
        {/* Ghost silhouettes — absolute inside shell, z-index 0, above shell bg, below all content */}
        <GhostBackground />

        {/* Mobile sidebar backdrop */}
        {isMobile && sidebarOpen && (
          <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
        )}

        <div className="app-layout">
          {/* Sidebar — always rendered; slides in as overlay on mobile */}
          {(!isMobile || sidebarOpen) && (
            <FilterSidebar
              evidenceTypes={data.evidenceTypes}
              evidenceFilters={evidenceFilters}
              includeCount={includeCount}
              interactionDefs={data.interactions}
              interactionFilters={interactionFilters}
              onCycleEvidence={cycleEvidence}
              onSetInteraction={setInteractionFilter}
              onReset={reset}
              onClose={() => setSidebarOpen(false)}
              matchCount={filteredGhosts.length}
              totalCount={data.ghosts.length}
              mobileOpen={isMobile ? sidebarOpen : undefined}
            />
          )}

          <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
            {/* Header */}
            <div style={{
              padding: isMobile ? '16px 20px 14px' : '28px 32px 20px',
              borderBottom: `1px solid ${colors.border.panel}`,
              position: 'relative',
              overflow: 'hidden',
              flexShrink: 0,
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(90deg, rgba(79,195,247,0.03) 0%, transparent 60%)',
              }} />

              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative' }}>
                <div>
                  <div style={{
                    fontFamily: colors.font.display,
                    fontSize: isMobile ? 22 : 32,
                    letterSpacing: '0.08em',
                    color: colors.accent.blue,
                    textShadow: '0 0 20px rgba(79,195,247,0.5), 0 0 60px rgba(79,195,247,0.2)',
                    lineHeight: 1,
                    marginBottom: 4,
                    animation: 'titleFlicker 8s infinite',
                  }}>
                    PHASMOPHOBIA
                  </div>
                  <div style={{
                    fontFamily: colors.font.mono,
                    fontSize: isMobile ? 9 : 11,
                    color: colors.text.muted,
                    letterSpacing: '0.2em',
                  }}>
                    — GHOST ID SYSTEM — v{data.meta.version} —
                  </div>
                </div>

                {/* Mobile filter toggle */}
                {isMobile && (
                  <button
                    onClick={() => setSidebarOpen(true)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      background: activeFilterCount > 0 ? `${colors.accent.blue}15` : 'transparent',
                      border: `1px solid ${activeFilterCount > 0 ? colors.accent.blue : colors.border.panel}`,
                      color: activeFilterCount > 0 ? colors.accent.blue : colors.text.muted,
                      fontFamily: colors.font.mono,
                      fontSize: 10,
                      letterSpacing: '0.1em',
                      padding: '6px 12px',
                      borderRadius: 4,
                      flexShrink: 0,
                      marginTop: 4,
                    }}
                  >
                    ☰ Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
                  </button>
                )}
              </div>
            </div>

            {/* Ghost grid */}
            <div style={{ padding: isMobile ? '16px' : '24px 28px', overflowY: 'auto', flex: 1 }}>
              {filteredGhosts.length === 0 ? (
                <EmptyState onReset={reset} />
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile
                    ? 'repeat(auto-fill, minmax(260px, 1fr))'
                    : 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: isMobile ? 10 : 14,
                }}>
                  {data.ghosts.map((ghost) => {
                    const isVisible = visibleIds.has(ghost.id)
                    return (
                      <GhostCard
                        key={ghost.id}
                        ghost={ghost}
                        evidenceTypes={data.evidenceTypes}
                        evidenceFilters={evidenceFilters}
                        interactionDefs={data.interactions}
                        status={getCardStatus(ghost, includeCount, isVisible)}
                        visible={isVisible}
                        onClick={() => isVisible && setSelectedGhost(ghost)}
                      />
                    )
                  })}
                </div>
              )}
            </div>
          </main>
        </div>

        <GhostModal
          ghost={selectedGhost}
          evidenceTypes={data.evidenceTypes}
          interactionDefs={data.interactions}
          onClose={() => setSelectedGhost(null)}
        />
      </div>
    </>
  )
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60%', gap: 16, textAlign: 'center' }}>
      <div style={{ fontFamily: colors.font.display, fontSize: 24, color: colors.text.muted, letterSpacing: '0.1em' }}>
        No entities detected
        <div style={{ fontFamily: colors.font.mono, fontSize: 12, marginTop: 8, color: colors.text.muted }}>
          No ghosts match the current evidence
        </div>
      </div>
      <button
        onClick={onReset}
        style={{
          fontFamily: colors.font.mono, fontSize: 10, letterSpacing: '0.15em',
          textTransform: 'uppercase', padding: '8px 16px',
          border: `1px solid ${colors.text.muted}`, background: 'transparent',
          color: colors.text.muted, borderRadius: 4, cursor: 'crosshair',
        }}
      >
        ⟳ Clear all filters
      </button>
    </div>
  )
}
