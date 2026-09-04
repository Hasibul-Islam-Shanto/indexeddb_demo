import { beforeEach, describe, expect, it } from 'vitest'
import {
  addExpense,
  deleteExpense,
  getAllExpenses,
  getExpensesByAmount,
  getExpensesByCategory,
  queryExpenses,
  updateExpense,
} from './expense-indexed-db'
import {
  sampleExpense,
  sampleExpense2,
  sampleExpense3,
} from '../test/fixtures'

describe('expense-indexed-db', () => {
  describe('CRUD', () => {
    it('adds, reads, updates, and deletes expenses', async () => {
      await addExpense(sampleExpense)
      await addExpense(sampleExpense2)

      let all = await getAllExpenses()
      expect(all).toHaveLength(2)
      expect(all[0].id).toBe('exp-1')

      await updateExpense({ ...sampleExpense, description: 'Espresso' })
      all = await getAllExpenses()
      expect(all.find((e) => e.id === 'exp-1')?.description).toBe('Espresso')

      await deleteExpense('exp-1')
      all = await getAllExpenses()
      expect(all).toHaveLength(1)
      expect(all[0].id).toBe('exp-2')
    })

    it('returns expenses sorted by date descending', async () => {
      await addExpense(sampleExpense2)
      await addExpense(sampleExpense)
      await addExpense(sampleExpense3)

      const all = await getAllExpenses()
      expect(all.map((e) => e.id)).toEqual(['exp-1', 'exp-3', 'exp-2'])
    })
  })

  describe('index queries', () => {
    beforeEach(async () => {
      await addExpense(sampleExpense)
      await addExpense(sampleExpense2)
      await addExpense(sampleExpense3)
    })

    it('filters by category', async () => {
      const food = await getExpensesByCategory('food')
      expect(food).toHaveLength(2)
      expect(food.every((e) => e.category === 'food')).toBe(true)
    })

    it('filters by exact amount', async () => {
      const matches = await getExpensesByAmount(8.5)
      expect(matches).toHaveLength(2)
      expect(matches.every((e) => e.amount === 8.5)).toBe(true)
    })
  })

  describe('queryExpenses', () => {
    beforeEach(async () => {
      await addExpense(sampleExpense)
      await addExpense(sampleExpense2)
      await addExpense(sampleExpense3)
    })

    it('returns all expenses when no filters', async () => {
      const results = await queryExpenses({})
      expect(results).toHaveLength(3)
    })

    it('filters by category only', async () => {
      const results = await queryExpenses({ category: 'transport' })
      expect(results).toHaveLength(1)
      expect(results[0].id).toBe('exp-2')
    })

    it('filters by amount only', async () => {
      const results = await queryExpenses({ amount: 8.5 })
      expect(results).toHaveLength(2)
    })

    it('combines category and amount filters', async () => {
      const results = await queryExpenses({ category: 'food', amount: 8.5 })
      expect(results).toHaveLength(1)
      expect(results[0].id).toBe('exp-3')
    })

    it('treats NaN amount as no filter', async () => {
      const results = await queryExpenses({ amount: Number.NaN })
      expect(results).toHaveLength(3)
    })
  })
})
