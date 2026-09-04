import { DB_NAME } from '../db/constants'
import { resetDbCache } from '../db/expense-indexed-db'

export async function resetTestDb(): Promise<void> {
  resetDbCache()
  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DB_NAME)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
    request.onblocked = () => resolve()
  })
}
