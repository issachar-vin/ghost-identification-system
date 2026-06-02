import type { EvidenceType, EvidenceFilterState } from '../types'
import { colors } from '../theme'
import '../styles/animations.css'

interface Props {
  evidenceType: EvidenceType
  state: EvidenceFilterState
  onCycle: () => void
  includeDisabled: boolean
}

export function EvidenceFilterItem({ evidenceType, state, onCycle, includeDisabled }: Props) {
  const isConfirmed = state === 'include'
  const isRuledOut = state === 'exclude'

  return (
    <div
      onClick={onCycle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onCycle()}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 6px',
        borderRadius: '6px',
        cursor: 'crosshair',
        transition: 'background 0.15s',
        marginBottom: '2px',
        position: 'relative',
        userSelect: 'none',
        background: isConfirmed
          ? 'rgba(76,175,80,0.06)'
          : isRuledOut
          ? 'rgba(255,68,68,0.06)'
          : 'transparent',
        opacity: includeDisabled ? 0.5 : 1,
      }}
    >
      {isConfirmed && (
        <div style={{
          position: 'absolute',
          left: 2, right: 2, top: 2, bottom: 2,
          borderRadius: '30px',
          border: `1.5px solid ${colors.accent.green}`,
          pointerEvents: 'none',
          boxShadow: '0 0 10px rgba(76,175,80,0.3)',
          animation: 'ovalFlicker 3s infinite',
        }} />
      )}

      {isRuledOut && (
        <div key={`strike-${evidenceType.id}-exclude`} style={{
          position: 'absolute',
          left: 8, right: 8,
          top: '50%',
          height: '1.5px',
          background: colors.accent.red,
          borderRadius: '1px',
          boxShadow: `0 0 6px ${colors.accent.red}`,
          transformOrigin: 'left center',
          animation: 'strikeIn 0.25s cubic-bezier(0.22,1,0.36,1) forwards',
          pointerEvents: 'none',
        }} />
      )}

      <div style={{
        width: 20,
        height: 20,
        borderRadius: 3,
        border: `1.5px solid ${
          isConfirmed ? colors.accent.green
          : isRuledOut ? colors.accent.red
          : colors.text.muted
        }`,
        background: isConfirmed
          ? colors.accent.greenDim
          : isRuledOut
          ? colors.accent.redDim
          : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'all 0.2s',
        position: 'relative',
        boxShadow: isConfirmed
          ? '0 0 8px rgba(76,175,80,0.4), inset 0 0 4px rgba(76,175,80,0.2)'
          : isRuledOut
          ? '0 0 8px rgba(255,68,68,0.3)'
          : 'none',
      }}>
        {isConfirmed && (
          <div style={{
            width: 10, height: 10,
            background: colors.accent.green,
            borderRadius: '50%',
            boxShadow: `0 0 6px ${colors.accent.green}`,
            animation: 'pulseGreen 1.5s infinite',
          }} />
        )}
        {isRuledOut && (
          <svg viewBox="0 0 26 26" fill="none" stroke={colors.accent.red} strokeWidth="3" strokeLinecap="round" style={{ width: 16, height: 16 }}>
            <line x1="6" y1="6" x2="20" y2="20" />
            <line x1="20" y1="6" x2="6" y2="20" />
          </svg>
        )}
      </div>

      <span style={{
        fontFamily: colors.font.mono,
        fontSize: '12px',
        color: isConfirmed ? colors.accent.green : isRuledOut ? colors.accent.red : colors.text.secondary,
        transition: 'color 0.2s',
        flex: 1,
        lineHeight: 1.3,
        textDecoration: isRuledOut ? 'line-through' : 'none',
        textDecorationColor: colors.accent.red,
      }}>
        {evidenceType.shortName}
      </span>
    </div>
  )
}
