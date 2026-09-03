import { TrendingDown, TrendingUp } from 'lucide-react'
import { PREVIOUS_PERIOD_TOTAL, CATEGORIES } from '../../data/categories'
import { formatCurrency, sumByCategory, totalAmount } from '../../lib/format'
import type { Expense } from '../../types'
import { CategoryDot } from '../../ui/category-dot'
import { DonutChart } from './donut-chart'

type SummaryCardProps = {
  expenses: Expense[]
}

export function SummaryCard({ expenses }: SummaryCardProps) {
  const total = totalAmount(expenses)
  const byCategory = sumByCategory(expenses)
  const previous = PREVIOUS_PERIOD_TOTAL as number
  const delta = total - previous
  const pct = previous === 0 ? 0 : Math.round((delta / previous) * 100)
  const isUp = delta > 0

  return (
    <section className="rounded-xl border border-border bg-surface p-5 sm:p-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-sm text-text-secondary">Spent this period</p>
          <p className="mt-1 font-mono text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
            {formatCurrency(total)}
          </p>

          <div className="mt-3 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${
                isUp
                  ? 'bg-expense/10 text-expense'
                  : 'bg-accent/10 text-accent'
              }`}
            >
              {isUp ? (
                <TrendingUp className="h-3.5 w-3.5" aria-hidden />
              ) : (
                <TrendingDown className="h-3.5 w-3.5" aria-hidden />
              )}
              {isUp ? '+' : ''}
              {pct}%
            </span>
            <span className="text-xs text-text-muted">vs last period</span>
          </div>

          <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
            {CATEGORIES.map((cat) => (
              <li key={cat.id} className="flex items-center gap-1.5 text-xs">
                <CategoryDot color={cat.colorVar} size="md" />
                <span className="text-text-secondary">{cat.label}</span>
                <span className="font-mono text-text-muted">
                  {formatCurrency(byCategory[cat.id])}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex shrink-0 justify-center sm:justify-end">
          <DonutChart totals={byCategory} />
        </div>
      </div>
    </section>
  )
}
