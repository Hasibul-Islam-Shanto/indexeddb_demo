import type { CategoryId, Expense } from '../types'
import { CATEGORIES } from '../data/categories'

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(iso: string): string {
  const d = new Date(iso + 'T12:00:00')
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(d)
}

export function formatFullDate(date = new Date()): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function getCategory(id: CategoryId) {
  return CATEGORIES.find((c) => c.id === id)!
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function sumByCategory(expenses: Expense[]): Record<CategoryId, number> {
  const totals = {
    food: 0,
    transport: 0,
    shopping: 0,
    bills: 0,
    fun: 0,
  } satisfies Record<CategoryId, number>

  for (const e of expenses) {
    totals[e.category] += e.amount
  }
  return totals
}

export function totalAmount(expenses: Expense[]): number {
  return expenses.reduce((sum, e) => sum + e.amount, 0)
}
