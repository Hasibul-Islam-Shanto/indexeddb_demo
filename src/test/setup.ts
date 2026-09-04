import '@testing-library/jest-dom/vitest'
import 'fake-indexeddb/auto'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'
import { resetTestDb } from './db-helpers'

afterEach(async () => {
  cleanup()
  await resetTestDb()
})
