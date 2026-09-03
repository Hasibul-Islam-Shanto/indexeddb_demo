import { useCallback, useEffect, useState } from 'react'
import {
  addExpense as addExpenseToDb,
  deleteExpense as deleteExpenseFromDb,
  getAllExpenses,
  queryExpenses,
  updateExpense as updateExpenseInDb,
} from '../db/expense-indexed-db'
import type { CategoryId, Expense } from '../types'

function parseAmountSearch(value: string): number | undefined {
  const trimmed = value.trim()
  if (!trimmed) return undefined
  const parsed = Number.parseFloat(trimmed)
  return Number.isNaN(parsed) ? undefined : parsed
}

async function fetchExpenses(category: CategoryId | 'all', amountSearch: string) {
  const amount = parseAmountSearch(amountSearch)
  return Promise.all([
    getAllExpenses(),
    queryExpenses({ category, amount }),
  ])
}

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [filtered, setFiltered] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [amountSearch, setAmountSearch] = useState('')
  const [category, setCategory] = useState<CategoryId | 'all'>('all')

  const refresh = useCallback(async () => {
    const [all, list] = await fetchExpenses(category, amountSearch)
    setExpenses(all)
    setFiltered(list)
  }, [category, amountSearch])

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [all, list] = await fetchExpenses(category, amountSearch)
        if (!cancelled) {
          setExpenses(all)
          setFiltered(list)
        }
      } catch (error) {
        console.error(error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [category, amountSearch])

  const addExpense = useCallback(
    async (data: Omit<Expense, 'id'>) => {
      await addExpenseToDb({ ...data, id: crypto.randomUUID() })
      await refresh()
    },
    [refresh],
  )

  const updateExpense = useCallback(
    async (expense: Expense) => {
      await updateExpenseInDb(expense)
      await refresh()
    },
    [refresh],
  )

  const deleteExpense = useCallback(
    async (id: string) => {
      await deleteExpenseFromDb(id)
      await refresh()
    },
    [refresh],
  )

  return {
    expenses,
    filtered,
    loading,
    amountSearch,
    setAmountSearch,
    category,
    setCategory,
    addExpense,
    updateExpense,
    deleteExpense,
  }
}
