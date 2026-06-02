import { useEffect } from 'react'
import type { Ghost, InteractionDefinition, EvidenceType } from '../types'
import { colors } from '../theme'
import '../styles/animations.css'

interface Props {
  ghost: Ghost | null
  evidenceTypes: EvidenceType[]
  interactionDefs: InteractionDefinition[]
  onClose: () => void
}

const categoryLabels: Record<string, string> = {
  hunt: 'Hunt Behavior',
  evidence: 'Evidence Quirks',
  environment: 'Environment',
  sanity: 'Sanity',
  equipment: 'Equipment',
  general: 'General',
}

export function GhostModal({ ghost, evidenceTypes, interactionDefs, onClose }: Props) {
  useEffect(() => {
    if (!ghost) return
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [ghost, onClose])

  if (!ghost) return null

  const behaviorsByCategory = ghost.uniqueBehaviors.reduce(
    (acc, b) => {
      if (!acc[b.category]) acc[b.category] = []
      acc[b.category].push(b)
      return acc
    },
    {} as Record<string, typeof ghost.uniqueBehaviors>
  )

  const interactionOverrides = interactionDefs.filter(
    (def) => def.id in ghost.interactions
  )

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: colors.background.overlay,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '24px',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: colors.background.card,
          border: `1px solid ${colors.border.medium}`,
          borderRadius: '16px',
          width: '100%',
          maxWidth: '640px',
          maxHeight: '85vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: `0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px ${colors.border.subtle}`,
        }}
      >
        {/* Modal header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: `1px solid ${colors.border.subtle}`,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <div>
            <h2 style={{ fontFamily: colors.font.display, fontSize: '26px', fontWeight: 400, color: colors.accent.blue, margin: '0 0 8px', letterSpacing: '0.05em', textShadow: '0 0 16px rgba(79,195,247,0.4)' }}>
              {ghost.name}{ghost.isNew && <span style={{ fontFamily: colors.font.mono, fontSize: 10, marginLeft: 10, padding: '2px 8px', border: `1px solid ${colors.accent.newGlow}`, color: colors.accent.newGlow, borderRadius: 20, verticalAlign: 'middle', animation: 'newPulse 2s infinite' }}>NEW</span>}
            </h2>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {ghost.evidence.map((eid) => {
                const et = evidenceTypes.find((e) => e.id === eid)
                const c = colors.evidence[eid]
                return (
                  <div key={eid} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        padding: '4px 10px',
                        borderRadius: '5px',
                        background: `${c}20`,
                        color: c,
                        border: `1px solid ${c}50`,
                      }}
                    >
                      {et?.name ?? eid}
                    </span>
                  </div>
                )
              })}
              {ghost.fakeEvidence?.map((eid) => {
                const et = evidenceTypes.find((e) => e.id === eid)
                return (
                  <span
                    key={`fake-${eid}`}
                    title="Fake evidence — always present but not real"
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: '5px',
                      background: `${colors.text.muted}15`,
                      color: colors.text.muted,
                      border: `1px dashed ${colors.text.muted}50`,
                      textDecoration: 'line-through',
                    }}
                  >
                    {et?.name ?? eid} (fake)
                  </span>
                )
              })}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: `1px solid ${colors.border.subtle}`,
              color: colors.text.muted,
              borderRadius: '6px',
              width: '30px',
              height: '30px',
              fontSize: '16px',
              cursor: 'pointer',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal body — scrollable */}
        <div style={{ overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Strength / Weakness */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={statBoxStyle(colors.accent.red)}>
              <div style={statLabelStyle}>Strength</div>
              <p style={statTextStyle}>{ghost.strength}</p>
            </div>
            <div style={statBoxStyle(colors.accent.teal)}>
              <div style={statLabelStyle}>Weakness</div>
              <p style={statTextStyle}>{ghost.weakness}</p>
            </div>
          </div>

          {/* Hunt threshold */}
          <div style={statBoxStyle(colors.accent.amber)}>
            <div style={statLabelStyle}>Hunt Sanity Threshold</div>
            <p style={statTextStyle}>
              <strong>{ghost.huntSanityThreshold}%</strong>
              {ghost.huntSanityThresholdNotes && ` — ${ghost.huntSanityThresholdNotes}`}
            </p>
          </div>

          {/* Unique behaviors */}
          {Object.entries(behaviorsByCategory).map(([category, behaviors]) => (
            <div key={category}>
              <div style={subheaderStyle}>{categoryLabels[category] ?? category}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {behaviors.map((b, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <span style={{ color: b.identifyValue === 'high' ? colors.accent.purpleLight : colors.text.muted, fontSize: '12px', marginTop: '2px', flexShrink: 0 }}>
                      {b.identifyValue === 'high' ? '★' : '·'}
                    </span>
                    <p style={{ fontSize: '13px', color: colors.text.secondary, margin: 0, lineHeight: '1.5' }}>
                      {b.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Identifying clues */}
          <div>
            <div style={subheaderStyle}>Identifying Clues</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {ghost.identifyingClues.map((clue, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <span style={{ color: colors.accent.teal, fontSize: '12px', marginTop: '2px', flexShrink: 0 }}>→</span>
                  <p style={{ fontSize: '13px', color: colors.text.secondary, margin: 0, lineHeight: '1.5' }}>
                    {clue}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Notable interaction overrides */}
          {interactionOverrides.length > 0 && (
            <div>
              <div style={subheaderStyle}>Notable Behaviors</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {interactionOverrides.map((def) => {
                  const ghostValue = ghost.interactions[def.id]
                  let valueLabel = ''
                  let valueColor = colors.accent.amber

                  if (def.filterType === 'toggle') {
                    valueLabel = ghostValue ? def.trueLabel : def.falseLabel
                    valueColor = ghostValue ? colors.accent.teal : colors.accent.red
                  } else {
                    const opt = def.options.find((o) => o.value === ghostValue)
                    valueLabel = opt?.label ?? String(ghostValue)
                    valueColor = colors.accent.amber
                  }

                  return (
                    <div key={def.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', borderRadius: '6px', background: colors.background.secondary }}>
                      <div>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: colors.text.primary }}>{def.label}</span>
                        <p style={{ fontSize: '11px', color: colors.text.muted, margin: '1px 0 0' }}>{def.description}</p>
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: `${valueColor}20`, color: valueColor, border: `1px solid ${valueColor}40`, whiteSpace: 'nowrap', marginLeft: '12px' }}>
                        {valueLabel}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function statBoxStyle(accentColor: string): React.CSSProperties {
  return {
    padding: '10px 14px',
    borderRadius: '8px',
    background: `${accentColor}08`,
    border: `1px solid ${accentColor}25`,
  }
}

const statLabelStyle: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  color: colors.text.muted,
  marginBottom: '4px',
}

const statTextStyle: React.CSSProperties = {
  fontSize: '13px',
  color: colors.text.secondary,
  margin: 0,
  lineHeight: '1.5',
}

const subheaderStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  color: colors.text.muted,
  marginBottom: '8px',
}
