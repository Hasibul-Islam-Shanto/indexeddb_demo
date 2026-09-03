import { Search } from 'lucide-react'
import { CATEGORIES } from '../../data/categories'
import type { CategoryId } from '../../types'
import { FilterPill } from '../../ui/filter-pill'

type FilterRowProps = {
  amountSearch: string
  onAmountSearchChange: (value: string) => void
  category: CategoryId | 'all'
  onCategoryChange: (value: CategoryId | 'all') => void
}

export function FilterRow({
  amountSearch,
  onAmountSearchChange,
  category,
  onCategoryChange,
}: FilterRowProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <label className="relative block min-w-0 flex-1 sm:max-w-xs">
        <span className="sr-only">Search by amount</span>
        <Search
          className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-text-muted"
          aria-hidden
        />
        <input
          type="search"
          inputMode="decimal"
          value={amountSearch}
          onChange={(e) => onAmountSearchChange(e.target.value)}
          placeholder="Search by amount…"
          className="w-full rounded-lg border border-border bg-surface py-2.5 pr-3 pl-9 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-accent"
        />
      </label>

      <div
        className="flex flex-wrap gap-1.5"
        role="group"
        aria-label="Filter by category"
      >
        <FilterPill
          label="All"
          active={category === 'all'}
          onClick={() => onCategoryChange('all')}
        />
        {CATEGORIES.map((cat) => (
          <FilterPill
            key={cat.id}
            label={cat.label}
            color={cat.colorVar}
            active={category === cat.id}
            onClick={() => onCategoryChange(cat.id)}
          />
        ))}
      </div>
    </div>
  )
}
