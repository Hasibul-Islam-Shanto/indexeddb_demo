import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { CATEGORIES } from '../../data/categories'
import type { CategoryId, Expense } from '../../types'
import { FilterPill } from '../../ui/filter-pill'

type ExpenseDrawerProps = {
  open: boolean
  expense?: Expense | null
  onClose: () => void
  onSave: (data: Omit<Expense, 'id'>) => Promise<void>
  onUpdate: (expense: Expense) => Promise<void>
}

function getInitialForm(expense?: Expense | null) {
  if (expense) {
    return {
      amount: String(expense.amount),
      category: expense.category,
      note: expense.note ?? '',
      date: expense.date,
      description: expense.description,
    }
  }
  return {
    amount: '',
    category: 'food' as CategoryId,
    note: '',
    date: new Date().toISOString().slice(0, 10),
    description: '',
  }
}

export function ExpenseDrawer({
  open,
  expense,
  onClose,
  onSave,
  onUpdate,
}: ExpenseDrawerProps) {
  const isEdit = expense != null
  const titleId = useId()
  const [closing, setClosing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const amountRef = useRef<HTMLInputElement>(null)
  const closingRef = useRef(false)

  const initial = getInitialForm(expense)
  const [amount, setAmount] = useState(initial.amount)
  const [category, setCategory] = useState<CategoryId>(initial.category)
  const [note, setNote] = useState(initial.note)
  const [date, setDate] = useState(initial.date)
  const [description, setDescription] = useState(initial.description)

  useEffect(() => {
    if (!open) return
    const t = window.setTimeout(() => amountRef.current?.focus(), 50)
    return () => window.clearTimeout(t)
  }, [open])

  const handleClose = useCallback(() => {
    if (closingRef.current || submitting) return
    closingRef.current = true
    setClosing(true)
    window.setTimeout(() => {
      setClosing(false)
      closingRef.current = false
      onClose()
    }, 200)
  }, [onClose, submitting])

  useEffect(() => {
    if (!open) return

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClose()
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, handleClose])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const parsed = Number.parseFloat(amount)
    if (!description.trim() || Number.isNaN(parsed) || parsed <= 0) return

    const payload = {
      description: description.trim(),
      amount: Math.round(parsed * 100) / 100,
      category,
      date,
      note: note.trim() || undefined,
    }

    setSubmitting(true)
    try {
      if (isEdit && expense) {
        await onUpdate({ ...payload, id: expense.id })
      } else {
        await onSave(payload)
      }
      handleClose()
    } catch (error) {
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  if (!open && !closing) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="presentation">
      <button
        type="button"
        aria-label="Close drawer"
        className={`absolute inset-0 bg-text-primary/25 backdrop-blur-[3px] ${
          closing ? 'animate-backdrop-out' : 'animate-backdrop-in'
        }`}
        onClick={handleClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative flex h-full w-full max-w-md flex-col border-l border-border bg-surface shadow-xl ${
          closing ? 'animate-drawer-out' : 'animate-drawer-in'
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2
            id={titleId}
            className="font-serif text-xl font-semibold text-text-primary"
          >
            {isEdit ? 'Edit expense' : 'Add expense'}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="btn-press rounded-lg p-1.5 text-text-secondary hover:bg-surface-alt hover:text-text-primary"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col gap-5 overflow-y-auto p-5 scrollbar-thin"
        >
          <div>
            <label
              htmlFor="expense-amount"
              className="mb-1.5 block text-sm text-text-secondary"
            >
              Amount
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 font-mono text-text-muted">
                $
              </span>
              <input
                id="expense-amount"
                ref={amountRef}
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-lg border border-border bg-background py-3 pr-3 pl-8 font-mono text-lg text-text-primary placeholder:text-text-muted focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="expense-description"
              className="mb-1.5 block text-sm text-text-secondary"
            >
              Description
            </label>
            <input
              id="expense-description"
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What did you spend on?"
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent"
            />
          </div>

          <fieldset>
            <legend className="mb-1.5 text-sm text-text-secondary">
              Category
            </legend>
            <div className="flex flex-wrap gap-1.5" role="radiogroup">
              {CATEGORIES.map((cat) => (
                <FilterPill
                  key={cat.id}
                  label={cat.label}
                  color={cat.colorVar}
                  active={category === cat.id}
                  onClick={() => setCategory(cat.id)}
                />
              ))}
            </div>
          </fieldset>

          <div>
            <label
              htmlFor="expense-note"
              className="mb-1.5 block text-sm text-text-secondary"
            >
              Note
            </label>
            <textarea
              id="expense-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Optional details…"
              className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent"
            />
          </div>

          <div>
            <label
              htmlFor="expense-date"
              className="mb-1.5 block text-sm text-text-secondary"
            >
              Date
            </label>
            <input
              id="expense-date"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 font-mono text-sm text-text-primary focus:border-accent"
            />
          </div>

          <div className="mt-auto border-t border-border pt-5">
            <button
              type="submit"
              disabled={submitting}
              className="btn-press w-full rounded-lg bg-accent py-3 text-sm font-medium text-white hover:brightness-110 disabled:opacity-60"
            >
              {submitting
                ? 'Saving…'
                : isEdit
                  ? 'Update expense'
                  : 'Save expense'}
            </button>
          </div>
        </form>
      </aside>
    </div>
  )
}
