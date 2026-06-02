import { useState } from 'react'
import type { Ghost, InteractionDefinition, EvidenceType } from '../types'
import { colors } from '../theme'
import '../styles/animations.css'

interface Props {
  ghost: Ghost
  evidenceTypes: EvidenceType[]
  interactionDefs: InteractionDefinition[]
  onClick: () => void
}

function getInteractionBadges(
  ghost: Ghost,
  defs: InteractionDefinition[]
): Array<{ label: string; color: string }> {
  const badges: Array<{ label: string; color: string }> = []

  for (const def of defs) {
    const ghostValue = def.id in ghost.interactions ? ghost.interactions[def.id] : def.defaultValue
    if (ghostValue === def.defaultValue) continue

    // Derive a short badge label from the override value
    if (def.filterType === 'toggle') {
      const label = ghostValue ? def.trueLabel : def.falseLabel
      const isBad = !ghostValue && def.id !== 'dotsVisibleNaked'
      badges.push({ label, color: isBad ? colors.accent.red : colors.accent.teal })
    } else {
      const opt = def.options.find((o) => o.value === ghostValue)
      if (opt) {
        const badgeColor =
          ghostValue === 'early'
            ? colors.accent.red
            : ghostValue === 'late'
              ? colors.accent.teal
              : colors.accent.amber
        badges.push({ label: opt.label, color: badgeColor })
      }
    }
  }

  return badges.slice(0, 3)
}

export function GhostCard({ ghost, evidenceTypes, interactionDefs, onClick }: Props) {
  const [hovered, setHovered] = useState(false)

  const topClues = ghost.identifyingClues.slice(0, 2)
  const badges = getInteractionBadges(ghost, interactionDefs)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? colors.background.cardHover : colors.background.card,
        border: `1px solid ${hovered ? colors.border.strong : colors.border.subtle}`,
        borderRadius: '10px',
        padding: '16px',
        cursor: 'pointer',
        transition: 'border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease',
        transform: 'none',
        boxShadow: hovered
          ? `0 0 18px rgba(57,255,20,0.1), inset 0 0 30px rgba(57,255,20,0.03)`
          : 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        animation: 'ghost-appear 0.35s ease forwards',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Name */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3 style={{
          fontSize: '15px',
          fontWeight: 700,
          color: colors.text.accent,
          margin: 0,
          fontFamily: "'Courier New', monospace",
          textShadow: hovered ? `0 0 8px rgba(57,255,20,0.4)` : 'none',
          transition: 'text-shadow 0.2s ease',
        }}>
          {ghost.name}
        </h3>
        <span style={{ fontSize: '10px', color: colors.text.muted, fontFamily: 'monospace' }}>
          {ghost.huntSanityThreshold}% hunt
        </span>
      </div>

      {/* Evidence pills */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {ghost.evidence.map((eid) => {
          const et = evidenceTypes.find((e) => e.id === eid)
          const c = colors.evidence[eid]
          return (
            <span
              key={eid}
              title={et?.name}
              style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '3px 8px',
                borderRadius: '4px',
                background: `${c}20`,
                color: c,
                border: `1px solid ${c}50`,
              }}
            >
              {et?.shortName ?? eid}
            </span>
          )
        })}
        {ghost.fakeEvidence?.map((eid) => {
          const et = evidenceTypes.find((e) => e.id === eid)
          return (
            <span
              key={`fake-${eid}`}
              title={`Fake: ${et?.name}`}
              style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '3px 8px',
                borderRadius: '4px',
                background: `${colors.text.muted}15`,
                color: colors.text.muted,
                border: `1px dashed ${colors.text.muted}50`,
                textDecoration: 'line-through',
              }}
            >
              {et?.shortName ?? eid}
            </span>
          )
        })}
      </div>

      {/* Identifying clues */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {topClues.map((clue, i) => (
          <p
            key={i}
            style={{
              fontSize: '12px',
              color: colors.text.secondary,
              margin: 0,
              lineHeight: '1.4',
              paddingLeft: '10px',
              borderLeft: `2px solid ${colors.border.medium}`,
            }}
          >
            {clue}
          </p>
        ))}
      </div>

      {/* Interaction override badges */}
      {badges.length > 0 && (
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
          {badges.map((b, i) => (
            <span
              key={i}
              style={{
                fontSize: '10px',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: '3px',
                background: `${b.color}18`,
                color: b.color,
                border: `1px solid ${b.color}40`,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {b.label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
