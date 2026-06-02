import type { CategoryInteraction } from '../types'
import { colors } from '../theme'

interface Props {
  definition: CategoryInteraction
  value: string | null
  onChange: (v: string | null) => void
}

export function CategoryFilter({ definition, value, onChange }: Props) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ fontSize: '12px', fontWeight: 600, color: colors.text.secondary, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {definition.label}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
        <button
          onClick={() => onChange(null)}
          style={optionStyle(value === null, null)}
        >
          Any
        </button>
        {definition.options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            title={opt.description}
            style={optionStyle(value === opt.value, opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function optionStyle(active: boolean, _value: string | null): React.CSSProperties {
  return {
    width: '100%',
    textAlign: 'left',
    padding: '5px 10px',
    fontSize: '12px',
    fontWeight: active ? 600 : 400,
    borderRadius: '6px',
    border: `1px solid ${active ? colors.accent.purple : colors.border.subtle}`,
    background: active ? `${colors.accent.purple}20` : 'transparent',
    color: active ? colors.accent.purpleLight : colors.text.secondary,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  }
}
