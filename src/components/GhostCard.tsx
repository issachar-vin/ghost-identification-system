import { useEffect, useRef, useState } from 'react'
import type { Ghost, InteractionDefinition, EvidenceType, EvidenceFilters } from '../types'
import { colors } from '../theme'
import '../styles/animations.css'

type CardStatus = 'normal' | 'possible' | 'confirmed'
type DisplayState = 'showing' | 'visible' | 'hiding' | 'hidden'

interface Props {
  ghost: Ghost
  evidenceTypes: EvidenceType[]
  evidenceFilters: EvidenceFilters
  interactionDefs: InteractionDefinition[]
  status: CardStatus
  visible: boolean
  onClick: () => void
}

function getInteractionBadges(ghost: Ghost, defs: InteractionDefinition[]) {
  const badges: Array<{ label: string; color: string }> = []
  for (const def of defs) {
    const ghostVal = def.id in ghost.interactions ? ghost.interactions[def.id] : def.defaultValue
    if (ghostVal === def.defaultValue) continue
    if (def.filterType === 'toggle') {
      badges.push({
        label: ghostVal ? def.trueLabel : def.falseLabel,
        color: String(ghostVal) === 'false' ? colors.accent.red : colors.accent.blue,
      })
    } else {
      const opt = def.options.find((o) => o.value === ghostVal)
      if (opt) badges.push({ label: opt.label, color: colors.accent.amber })
    }
  }
  return badges.slice(0, 3)
}

export function GhostCard({ ghost, evidenceTypes, evidenceFilters, interactionDefs, status, visible, onClick }: Props) {
  const [hovered, setHovered] = useState(false)
  const [displayState, setDisplayState] = useState<DisplayState>(visible ? 'visible' : 'hidden')
  const prevVisibleRef = useRef(visible)
  const [staticKey, setStaticKey] = useState(0)

  useEffect(() => {
    if (prevVisibleRef.current === visible) return
    prevVisibleRef.current = visible

    if (visible) {
      setDisplayState('showing')
      const t = setTimeout(() => setDisplayState('visible'), 350)
      return () => clearTimeout(t)
    } else {
      setDisplayState('hiding')
      // Trigger static burst on dissolve
      setStaticKey((k) => k + 1)
      const t = setTimeout(() => setDisplayState('hidden'), 280)
      return () => clearTimeout(t)
    }
  }, [visible])

  if (displayState === 'hidden') return null

  const animation =
    displayState === 'showing' ? 'cardMaterialize 0.35s cubic-bezier(0,0,0.2,1.4) forwards'
    : displayState === 'hiding' ? 'cardDissolve 0.28s cubic-bezier(0.4,0,1,1) forwards'
    : undefined

  const statusBarColor =
    status === 'confirmed' ? colors.accent.green
    : status === 'possible' ? colors.accent.blue
    : 'transparent'

  const statusBarOpacity = status === 'confirmed' ? 1 : status === 'possible' ? 0.6 : 0

  const badges = getInteractionBadges(ghost, interactionDefs)
  const topClues = ghost.identifyingClues.slice(0, 2)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? 'rgba(16, 24, 34, 0.82)'
          : 'rgba(10, 16, 24, 0.65)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        border: `1px solid ${hovered ? 'rgba(79,195,247,0.25)' : colors.border.card}`,
        borderRadius: 8,
        padding: 16,
        cursor: 'crosshair',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 260,
        transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), border-color 0.3s ease',
        transform: hovered ? 'translateY(-2px)' : 'none',
        animation,
        pointerEvents: displayState === 'hiding' ? 'none' : undefined,
      }}
    >
      {/* Top gradient line */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: 1,
        background: `linear-gradient(90deg, transparent, ${colors.accent.blueBright}, transparent)`,
        opacity: 0.3,
      }} />

      {/* Status bar */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: 3,
        borderRadius: '8px 8px 0 0',
        background: `linear-gradient(90deg, ${statusBarColor}, transparent)`,
        opacity: statusBarOpacity,
        transition: 'opacity 0.3s',
      }} />

      {/* Static burst overlay on dissolve */}
      {displayState === 'hiding' && (
        <div key={staticKey} style={{
          position: 'absolute',
          inset: 0,
          background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
          borderRadius: 8,
          animation: 'cardStaticBurst 0.3s ease forwards',
          zIndex: 10,
        }} />
      )}

      {/* Card top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{
          fontFamily: colors.font.display,
          fontSize: 21,
          color: colors.accent.blue,
          letterSpacing: '0.05em',
          textShadow: hovered ? '0 0 12px rgba(79,195,247,0.4)' : '0 0 12px rgba(79,195,247,0.2)',
          lineHeight: 1.1,
          transition: 'text-shadow 0.2s',
        }}>
          {ghost.name}
        </div>
        {ghost.isNew && (
          <span style={{
            fontFamily: colors.font.mono,
            fontSize: 9,
            padding: '2px 8px',
            border: `1px solid ${colors.accent.newGlow}`,
            color: colors.accent.newGlow,
            borderRadius: 20,
            letterSpacing: '0.1em',
            animation: 'newPulse 2s infinite',
            flexShrink: 0,
            marginTop: 2,
          }}>
            NEW
          </span>
        )}
      </div>

      {/* Evidence pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
        {ghost.evidence.map((eid) => {
          const et = evidenceTypes.find((e) => e.id === eid)
          const filterState = evidenceFilters[eid]
          const isConfirmed = filterState === 'include'
          const isRuledOut = filterState === 'exclude'
          const c = colors.evidence[eid]
          return (
            <span
              key={eid}
              style={{
                fontFamily: colors.font.mono,
                fontSize: 12,
                padding: '3px 8px',
                borderRadius: 3,
                letterSpacing: '0.03em',
                transition: 'all 0.2s',
                border: `1px solid ${
                  isConfirmed ? colors.accent.green
                  : isRuledOut ? colors.accent.red
                  : colors.border.card
                }`,
                color: isConfirmed ? colors.accent.green
                  : isRuledOut ? colors.accent.red
                  : colors.text.secondary,
                background: isConfirmed ? colors.accent.greenDim
                  : isRuledOut ? colors.accent.redDim
                  : `${c}10`,
                boxShadow: isConfirmed ? '0 0 8px rgba(76,175,80,0.2)'
                  : isRuledOut ? 'none'
                  : 'none',
                textDecoration: isRuledOut ? 'line-through' : 'none',
                opacity: isRuledOut ? 0.7 : 1,
              }}
            >
              {et?.shortName ?? eid}
            </span>
          )
        })}
        {ghost.fakeEvidence?.map((eid) => {
          const et = evidenceTypes.find((e) => e.id === eid)
          return (
            <span key={`fake-${eid}`} title="Always present — fake evidence" style={{
              fontFamily: colors.font.mono,
              fontSize: 12,
              padding: '3px 8px',
              borderRadius: 3,
              border: `1px dashed ${colors.text.muted}`,
              color: colors.text.muted,
              background: 'transparent',
              textDecoration: 'line-through',
            }}>
              {et?.shortName ?? eid}
            </span>
          )
        })}
      </div>

      {/* Divider */}
      <div style={{
        width: '100%', height: 1,
        background: `linear-gradient(90deg, transparent, ${colors.border.card}, transparent)`,
        marginBottom: 10,
      }} />

      {/* Quirks */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {topClues.map((clue, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: colors.text.muted, flexShrink: 0, marginTop: 6 }} />
            <div style={{ fontFamily: colors.font.body, fontSize: 14, color: '#7a9ab0', lineHeight: 1.5, fontStyle: 'italic' }}>
              {clue}
            </div>
          </div>
        ))}
      </div>

      {/* Interaction override badges */}
      {badges.length > 0 && (
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 10 }}>
          {badges.map((b, i) => (
            <span key={i} style={{
              fontFamily: colors.font.mono,
              fontSize: 10,
              fontWeight: 700,
              padding: '2px 7px',
              borderRadius: 3,
              background: `${b.color}15`,
              color: b.color,
              border: `1px solid ${b.color}40`,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}>
              {b.label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
