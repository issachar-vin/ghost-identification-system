import type { ToggleInteraction } from '../types'
import { colors } from '../theme'

interface Props {
  definition: ToggleInteraction
  value: boolean | null
  onChange: (v: boolean | null) => void
}

export function ToggleFilter({ definition, value, onChange }: Props) {
  const options: Array<{ label: string; value: boolean | null }> = [
    { label: 'Any', value: null },
    { label: definition.trueLabel, value: true },
    { label: definition.falseLabel, value: false },
  ]

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontFamily: colors.font.display, fontSize: 9, letterSpacing: '0.2em', color: colors.text.muted, textTransform: 'uppercase', marginBottom: 6 }}>
        {definition.label}
      </div>
      <div style={{ display: 'flex', gap: 4 }}>
        {options.map((opt) => {
          const active = value === opt.value
          const activeColor = opt.value === null ? colors.accent.blue
            : opt.value ? colors.accent.green
            : colors.accent.red
          return (
            <button
              key={String(opt.value)}
              onClick={() => onChange(opt.value)}
              style={{
                flex: 1,
                padding: '5px 4px',
                fontFamily: colors.font.mono,
                fontSize: 10,
                borderRadius: 4,
                border: `1px solid ${active ? activeColor : colors.border.panel}`,
                background: active ? `${activeColor}15` : 'transparent',
                color: active ? activeColor : colors.text.muted,
                cursor: 'crosshair',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                boxShadow: active ? `0 0 8px ${activeColor}30` : 'none',
              }}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
