import { DB_NAME, DB_VERSION, STORE } from './constants'
import type { CategoryId, Expense } from '../types'

let dbPromise: Promise<IDBDatabase> | null = null

const getDb = (): Promise<IDBDatabase> => {
  if (dbPromise) return dbPromise

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'id' })
        store.createIndex('date', 'date', { unique: false })
        store.createIndex('amount', 'amount', { unique: false })
        store.createIndex('category', 'category', { unique: false })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })

  return dbPromise
}

const customRequest = <T>(request: IDBRequest<T>): Promise<T> =>
  new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })

const sortByDateDesc = (expenses: Expense[]): Expense[] =>
  [...expenses].sort((a, b) => b.date.localeCompare(a.date))

export type ExpenseQuery = {
  category?: CategoryId | 'all'
  amount?: number
}

export const getAllExpenses = async (): Promise<Expense[]> => {
  const db = await getDb()
  const tx = db.transaction(STORE, 'readonly')
  return sortByDateDesc(await customRequest(tx.objectStore(STORE).getAll()))
}

export const getExpensesByCategory = async (
  category: CategoryId,
): Promise<Expense[]> => {
  const db = await getDb()
  const tx = db.transaction(STORE, 'readonly')
  const request = tx.objectStore(STORE).index('category').getAll(category)
  return sortByDateDesc(await customRequest(request))
}

export const getExpensesByAmount = async (amount: number): Promise<Expense[]> => {
  const db = await getDb()
  const tx = db.transaction(STORE, 'readonly')
  const request = tx.objectStore(STORE).index('amount').getAll(amount)
  return sortByDateDesc(await customRequest(request))
}

export const queryExpenses = async ({
  category,
  amount,
}: ExpenseQuery): Promise<Expense[]> => {
  const hasCategory = category && category !== 'all'
  const hasAmount = amount !== undefined && !Number.isNaN(amount)

  if (hasCategory && hasAmount) {
    const byCategory = await getExpensesByCategory(category)
    return byCategory.filter((e) => e.amount === amount)
  }
  if (hasCategory) return getExpensesByCategory(category)
  if (hasAmount) return getExpensesByAmount(amount)
  return getAllExpenses()
}

export const addExpense = async (expense: Expense): Promise<void> => {
  const db = await getDb()
  const tx = db.transaction(STORE, 'readwrite')
  await customRequest(tx.objectStore(STORE).add(expense))
}

export const updateExpense = async (expense: Expense): Promise<void> => {
  const db = await getDb()
  const tx = db.transaction(STORE, 'readwrite')
  await customRequest(tx.objectStore(STORE).put(expense))
}

export const deleteExpense = async (id: string): Promise<void> => {
  const db = await getDb()
  const tx = db.transaction(STORE, 'readwrite')
  await customRequest(tx.objectStore(STORE).delete(id))
}
