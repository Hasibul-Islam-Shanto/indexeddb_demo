import { useState } from 'react'
import { ExpenseContainer } from './components/expense/expense-container'
import { Sidebar } from './components/sidebar'
import { TopBar } from './components/top-bar'
import type { NavPage } from './types'

function App() {
  const [page, setPage] = useState<NavPage>('overview')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="flex min-h-svh bg-background">
      <Sidebar
        current={page}
        onNavigate={setPage}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          onAddExpense={() => setDrawerOpen(true)}
          onOpenMenu={() => setMobileOpen(true)}
        />

        <ExpenseContainer
          page={page}
          drawerOpen={drawerOpen}
          onCloseDrawer={() => setDrawerOpen(false)}
        />
      </div>
    </div>
  )
}

export default App
