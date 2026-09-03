export type CategoryId = 'food' | 'transport' | 'shopping' | 'bills' | 'fun'

export type Category = {
  id: CategoryId
  label: string
  colorVar: string
}

export type Expense = {
  id: string
  description: string
  amount: number
  category: CategoryId
  date: string
  note?: string
}

export type NavPage = 'overview' | 'categories' | 'settings'
