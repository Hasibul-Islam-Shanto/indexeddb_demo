import { describe, expect, it, vi } from 'vitest'
import {
  formatCurrency,
  formatDate,
  formatFullDate,
  getCategory,
  getGreeting,
  sumByCategory,
  totalAmount,
} from './format'
import { sampleExpense, sampleExpense2 } from '../test/fixtures'

describe('formatCurrency', () => {
  it('formats USD with two decimal places', () => {
    expect(formatCurrency(8.5)).toBe('$8.50')
    expect(formatCurrency(0)).toBe('$0.00')
    expect(formatCurrency(1234.5)).toBe('$1,234.50')
  })
})

describe('formatDate', () => {
  it('formats ISO date as short month and day', () => {
    expect(formatDate('2026-03-15')).toBe('Mar 15')
  })
})

describe('formatFullDate', () => {
  it('formats a full weekday date', () => {
    const date = new Date('2026-03-15T12:00:00')
    expect(formatFullDate(date)).toBe('Sunday, March 15')
  })
})

describe('getCategory', () => {
  it('returns category metadata by id', () => {
    const category = getCategory('food')
    expect(category.label).toBe('Food')
    expect(category.id).toBe('food')
  })
})

describe('getGreeting', () => {
  it('returns morning greeting before noon', () => {
    vi.setSystemTime(new Date('2026-03-15T09:00:00'))
    expect(getGreeting()).toBe('Good morning')
  })

  it('returns afternoon greeting before 5pm', () => {
    vi.setSystemTime(new Date('2026-03-15T14:00:00'))
    expect(getGreeting()).toBe('Good afternoon')
  })

  it('returns evening greeting after 5pm', () => {
    vi.setSystemTime(new Date('2026-03-15T20:00:00'))
    expect(getGreeting()).toBe('Good evening')
  })
})

describe('sumByCategory', () => {
  it('aggregates amounts by category', () => {
    const totals = sumByCategory([sampleExpense, sampleExpense2])
    expect(totals.food).toBe(5.5)
    expect(totals.transport).toBe(8.5)
    expect(totals.shopping).toBe(0)
  })
})

describe('totalAmount', () => {
  it('sums all expense amounts', () => {
    expect(totalAmount([])).toBe(0)
    expect(totalAmount([sampleExpense, sampleExpense2])).toBe(14)
  })
})
