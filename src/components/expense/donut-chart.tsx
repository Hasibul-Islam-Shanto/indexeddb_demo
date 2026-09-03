import type { CategoryId } from '../../types'
import { CATEGORIES } from '../../data/categories'

type DonutChartProps = {
  totals: Record<CategoryId, number>
  size?: number
}

export function DonutChart({ totals, size = 112 }: DonutChartProps) {
  const entries = CATEGORIES.map((c) => ({
    ...c,
    value: totals[c.id],
  })).filter((e) => e.value > 0)

  const sum = entries.reduce((s, e) => s + e.value, 0)
  if (sum === 0) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden>
        <circle
          cx="50"
          cy="50"
          r="36"
          fill="none"
          stroke="var(--border)"
          strokeWidth="12"
        />
      </svg>
    )
  }

  const radius = 36
  const circumference = 2 * Math.PI * radius

  const segments = entries.reduce<
    { id: string; colorVar: string; length: number; offset: number }[]
  >((acc, entry) => {
    const length = (entry.value / sum) * circumference
    const offset = acc.length === 0 ? 0 : acc[acc.length - 1].offset + acc[acc.length - 1].length
    acc.push({ id: entry.id, colorVar: entry.colorVar, length, offset })
    return acc
  }, [])

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label="Spending by category"
    >
      <g transform="rotate(-90 50 50)">
        {segments.map((segment) => (
          <circle
            key={segment.id}
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={segment.colorVar}
            strokeWidth="12"
            strokeDasharray={`${segment.length} ${circumference - segment.length}`}
            strokeDashoffset={-segment.offset}
            strokeLinecap="butt"
          />
        ))}
      </g>
      <circle cx="50" cy="50" r="26" fill="var(--surface)" />
    </svg>
  )
}
