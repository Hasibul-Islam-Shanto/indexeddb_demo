import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useExpenses } from './use-expenses'

beforeEach(() => {
  let id = 0
  vi.stubGlobal('crypto', {
    randomUUID: () => `generated-id-${++id}`,
  })
})

describe('useExpenses', () => {
  it('loads expenses on mount', async () => {
    const { result } = renderHook(() => useExpenses())

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.expenses).toEqual([])
    expect(result.current.filtered).toEqual([])
  })

  it('adds an expense and refreshes lists', async () => {
    const { result } = renderHook(() => useExpenses())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await act(async () => {
      await result.current.addExpense({
        description: 'Coffee',
        amount: 5.5,
        category: 'food',
        date: '2026-03-15',
      })
    })

    expect(result.current.expenses).toHaveLength(1)
    expect(result.current.expenses[0]).toMatchObject({
      id: 'generated-id-1',
      description: 'Coffee',
      amount: 5.5,
    })
    expect(result.current.filtered).toHaveLength(1)
  })

  it('filters by category', async () => {
    const { result } = renderHook(() => useExpenses())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await act(async () => {
      await result.current.addExpense({
        description: 'Coffee',
        amount: 5.5,
        category: 'food',
        date: '2026-03-15',
      })
      await result.current.addExpense({
        description: 'Bus',
        amount: 3,
        category: 'transport',
        date: '2026-03-14',
      })
    })

    act(() => {
      result.current.setCategory('food')
    })

    await waitFor(() => {
      expect(result.current.filtered).toHaveLength(1)
      expect(result.current.filtered[0].category).toBe('food')
    })

    expect(result.current.expenses).toHaveLength(2)
  })

  it('filters by amount search', async () => {
    const { result } = renderHook(() => useExpenses())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await act(async () => {
      await result.current.addExpense({
        description: 'Coffee',
        amount: 5.5,
        category: 'food',
        date: '2026-03-15',
      })
      await result.current.addExpense({
        description: 'Bus',
        amount: 8.5,
        category: 'transport',
        date: '2026-03-14',
      })
    })

    act(() => {
      result.current.setAmountSearch('8.5')
    })

    await waitFor(() => {
      expect(result.current.filtered).toHaveLength(1)
      expect(result.current.filtered[0].amount).toBe(8.5)
    })
  })

  it('updates and deletes expenses', async () => {
    const { result } = renderHook(() => useExpenses())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await act(async () => {
      await result.current.addExpense({
        description: 'Coffee',
        amount: 5.5,
        category: 'food',
        date: '2026-03-15',
      })
    })

    const expense = result.current.expenses[0]

    await act(async () => {
      await result.current.updateExpense({
        ...expense,
        description: 'Espresso',
      })
    })

    expect(result.current.expenses[0].description).toBe('Espresso')

    await act(async () => {
      await result.current.deleteExpense(expense.id)
    })

    expect(result.current.expenses).toHaveLength(0)
  })
})
