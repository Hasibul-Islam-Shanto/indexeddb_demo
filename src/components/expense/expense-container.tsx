import { useState } from 'react'
import { ExpenseDrawer } from './expense-drawer'
import { CategoriesView } from './categories-view'
import { ExpenseList } from './expense-list'
import { FilterRow } from './filter-row'
import { SummaryCard } from './summary-card'
import { SettingsView } from '../settings-view'
import { useExpenses } from '../../hooks/use-expenses'
import type { Expense, NavPage } from '../../types'

type ExpenseContainerProps = {
  page: NavPage
  drawerOpen: boolean
  onCloseDrawer: () => void
}

export function ExpenseContainer({
  page,
  drawerOpen,
  onCloseDrawer,
}: ExpenseContainerProps) {
  const [editExpense, setEditExpense] = useState<Expense | null>(null)

  const {
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
  } = useExpenses()

  const isDrawerOpen = drawerOpen || editExpense != null

  function handleCloseDrawer() {
    setEditExpense(null)
    onCloseDrawer()
  }

  return (
    <>
      <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 scrollbar-thin">
        <div className="mx-auto max-w-3xl">
          {page === 'overview' && (
            <div className="space-y-6">
              <SummaryCard expenses={expenses} />
              <FilterRow
                amountSearch={amountSearch}
                onAmountSearchChange={setAmountSearch}
                category={category}
                onCategoryChange={setCategory}
              />
              <ExpenseList
                expenses={filtered}
                loading={loading}
                onEdit={setEditExpense}
                onDelete={deleteExpense}
              />
            </div>
          )}

          {page === 'categories' && <CategoriesView expenses={expenses} />}

          {page === 'settings' && <SettingsView />}
        </div>
      </main>

      <ExpenseDrawer
        key={editExpense?.id ?? (drawerOpen ? 'add' : 'closed')}
        open={isDrawerOpen}
        expense={editExpense}
        onClose={handleCloseDrawer}
        onSave={addExpense}
        onUpdate={updateExpense}
      />
    </>
  )
}
