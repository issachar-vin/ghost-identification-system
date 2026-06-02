import type { EvidenceType, EvidenceFilterState } from '../types'
import { colors } from '../theme'

interface Props {
  evidenceType: EvidenceType
  state: EvidenceFilterState
  onCycle: () => void
  includeDisabled: boolean
}

const stateConfig = {
  off: {
    label: 'Any',
    icon: '○',
  },
  include: {
    label: 'Include',
    icon: '✓',
  },
  exclude: {
    label: 'Exclude',
    icon: '✕',
  },
} as const

export function EvidenceFilterItem({ evidenceType, state, onCycle, includeDisabled }: Props) {
  const evidenceColor = colors.evidence[evidenceType.id]

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 10px',
    borderRadius: '8px',
    cursor: 'pointer',
    border: `1px solid ${
      state === 'include'
        ? evidenceColor
        : state === 'exclude'
          ? colors.accent.red
          : colors.border.subtle
    }`,
    background:
      state === 'include'
        ? `${evidenceColor}15`
        : state === 'exclude'
          ? `${colors.accent.red}10`
          : 'transparent',
    transition: 'all 0.15s ease',
    userSelect: 'none',
  }

  const dotStyle: React.CSSProperties = {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: evidenceColor,
    flexShrink: 0,
  }

  const nameStyle: React.CSSProperties = {
    flex: 1,
    fontSize: '13px',
    fontWeight: 500,
    color:
      state === 'include'
        ? evidenceColor
        : state === 'exclude'
          ? colors.text.secondary
          : colors.text.primary,
    textDecoration: state === 'exclude' ? 'line-through' : 'none',
  }

  const badgeStyle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 600,
    padding: '2px 7px',
    borderRadius: '4px',
    background:
      state === 'include'
        ? evidenceColor
        : state === 'exclude'
          ? colors.accent.red
          : colors.background.card,
    color:
      state === 'off' ? colors.text.muted : '#fff',
    opacity: state === 'off' && includeDisabled ? 0.5 : 1,
  }

  return (
    <div style={containerStyle} onClick={onCycle} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? onCycle() : null}>
      <div style={dotStyle} />
      <span style={nameStyle}>{evidenceType.shortName}</span>
      <span style={badgeStyle}>
        {stateConfig[state].icon} {stateConfig[state].label}
      </span>
    </div>
  )
}
