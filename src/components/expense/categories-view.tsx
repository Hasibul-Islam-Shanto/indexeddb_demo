import { CATEGORIES } from '../../data/categories'
import { formatCurrency, sumByCategory } from '../../lib/format'
import type { Expense } from '../../types'
import { PageHeader } from '../../ui/page-header'

type CategoriesViewProps = {
  expenses: Expense[]
}

export function CategoriesView({ expenses }: CategoriesViewProps) {
  const totals = sumByCategory(expenses)
  const grand = Object.values(totals).reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Where your money went this period."
      />

      <ul className="overflow-hidden rounded-xl border border-border bg-surface">
        {CATEGORIES.map((cat, index) => {
          const amount = totals[cat.id]
          const pct = grand === 0 ? 0 : Math.round((amount / grand) * 100)
          const count = expenses.filter((e) => e.category === cat.id).length

          return (
            <li key={cat.id}>
              {index > 0 && <hr className="divider-perforated mx-4" />}
              <div
                className="animate-fade-rise px-5 py-4"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: cat.colorVar }}
                      aria-hidden
                    />
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {cat.label}
                      </p>
                      <p className="text-xs text-text-muted">
                        {count} {count === 1 ? 'entry' : 'entries'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm font-medium text-text-primary">
                      {formatCurrency(amount)}
                    </p>
                    <p className="font-mono text-xs text-text-muted">{pct}%</p>
                  </div>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-alt">
                  <div
                    className="h-full rounded-full transition-[width] duration-300 ease-out"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: cat.colorVar,
                    }}
                  />
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
