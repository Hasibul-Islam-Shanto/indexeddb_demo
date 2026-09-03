import { Pencil, Trash2, Film, Receipt, ShoppingBag, TrainFront, Utensils } from 'lucide-react'
import type { CategoryId, Expense } from '../../types'
import { formatCurrency, formatDate, getCategory } from '../../lib/format'
import { CategoryDot } from '../../ui/category-dot'
import { EmptyState } from '../../ui/empty-state'
import { LoadingState } from '../../ui/loading-state'
import { IconButton } from '../../ui/icon-button'

const ICONS: Record<CategoryId, typeof Utensils> = {
  food: Utensils,
  transport: TrainFront,
  shopping: ShoppingBag,
  bills: Receipt,
  fun: Film,
}

type ExpenseListProps = {
  expenses: Expense[]
  loading?: boolean
  onEdit: (expense: Expense) => void
  onDelete: (id: string) => void
}

export function ExpenseList({
  expenses,
  loading,
  onEdit,
  onDelete,
}: ExpenseListProps) {
  if (loading) return <LoadingState message="Loading expenses…" />

  if (expenses.length === 0) {
    return (
      <EmptyState
        title="No expenses found"
        description="Try a different amount or category filter."
      />
    )
  }

  return (
    <ul className="overflow-hidden rounded-xl border border-border bg-surface">
      {expenses.map((expense, index) => (
        <ExpenseItem
          key={expense.id}
          expense={expense}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}

function ExpenseItem({
  expense,
  index,
  onEdit,
  onDelete,
}: {
  expense: Expense
  index: number
  onEdit: (expense: Expense) => void
  onDelete: (id: string) => void
}) {
  const category = getCategory(expense.category)
  const Icon = ICONS[expense.category]

  function handleDelete() {
    if (window.confirm(`Delete "${expense.description}"?`)) {
      void onDelete(expense.id)
    }
  }

  return (
    <li
      className="animate-fade-rise group"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {index > 0 && <hr className="divider-perforated mx-4" />}
      <div className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-surface-alt sm:gap-4 sm:px-5">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
          style={{
            backgroundColor: `color-mix(in srgb, ${category.colorVar} 18%, transparent)`,
          }}
          aria-hidden
        >
          <Icon className="h-4 w-4" style={{ color: category.colorVar }} />
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-text-primary">
            {expense.description}
          </p>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-text-muted">
            <span className="inline-flex items-center gap-1">
              <CategoryDot color={category.colorVar} />
              {category.label}
            </span>
            <span aria-hidden>·</span>
            <time dateTime={expense.date}>{formatDate(expense.date)}</time>
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <p className="font-mono text-sm font-medium text-expense tabular-nums">
            −{formatCurrency(expense.amount)}
          </p>
          <div className="flex items-center gap-0.5 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
            <IconButton
              label={`Edit ${expense.description}`}
              onClick={() => onEdit(expense)}
              className="h-8 w-8 border-0 bg-transparent hover:bg-surface-alt"
            >
              <Pencil className="h-3.5 w-3.5" />
            </IconButton>
            <IconButton
              label={`Delete ${expense.description}`}
              onClick={handleDelete}
              className="h-8 w-8 border-0 bg-transparent text-expense hover:bg-expense/10"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </IconButton>
          </div>
        </div>
      </div>
    </li>
  )
}
