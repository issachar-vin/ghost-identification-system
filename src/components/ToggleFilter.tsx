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
    <div style={{ marginBottom: '14px' }}>
      <div style={{ fontSize: '12px', fontWeight: 600, color: colors.text.secondary, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {definition.label}
      </div>
      <div style={{ display: 'flex', gap: '4px' }}>
        {options.map((opt) => (
          <button
            key={String(opt.value)}
            onClick={() => onChange(opt.value)}
            style={{
              flex: 1,
              padding: '5px 6px',
              fontSize: '11px',
              fontWeight: 600,
              borderRadius: '6px',
              border: `1px solid ${
                value === opt.value
                  ? opt.value === null
                    ? colors.border.medium
                    : opt.value
                      ? colors.accent.teal
                      : colors.accent.red
                  : colors.border.subtle
              }`,
              background:
                value === opt.value
                  ? opt.value === null
                    ? colors.background.cardHover
                    : opt.value
                      ? `${colors.accent.teal}20`
                      : `${colors.accent.red}20`
                  : 'transparent',
              color:
                value === opt.value
                  ? opt.value === null
                    ? colors.text.primary
                    : opt.value
                      ? colors.accent.teal
                      : colors.accent.red
                  : colors.text.muted,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
