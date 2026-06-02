import type { CategoryInteraction } from '../types'
import { colors } from '../theme'

interface Props {
  definition: CategoryInteraction
  value: string | null
  onChange: (v: string | null) => void
}

export function CategoryFilter({ definition, value, onChange }: Props) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontFamily: colors.font.display, fontSize: 9, letterSpacing: '0.2em', color: colors.text.muted, textTransform: 'uppercase', marginBottom: 6 }}>
        {definition.label}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <button onClick={() => onChange(null)} style={optStyle(value === null)}>Any</button>
        {definition.options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            title={opt.description}
            style={optStyle(value === opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function optStyle(active: boolean): React.CSSProperties {
  return {
    width: '100%',
    textAlign: 'left',
    padding: '5px 10px',
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 11,
    borderRadius: 4,
    border: `1px solid ${active ? colors.accent.blue : colors.border.panel}`,
    background: active ? `${colors.accent.blue}12` : 'transparent',
    color: active ? colors.accent.blue : colors.text.muted,
    cursor: 'crosshair',
    transition: 'all 0.15s',
    boxShadow: active ? `0 0 8px rgba(79,195,247,0.15)` : 'none',
  }
}
