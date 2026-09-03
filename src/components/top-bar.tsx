import { Plus } from 'lucide-react'
import { formatFullDate, getGreeting } from '../lib/format'
import { MobileMenuButton } from '../ui/mobile-menu-button'
import { ThemeToggle } from './theme-toggle'

type TopBarProps = {
  onAddExpense: () => void
  onOpenMenu: () => void
}

export function TopBar({ onAddExpense, onOpenMenu }: TopBarProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-surface/80 px-4 py-4 backdrop-blur-sm sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <MobileMenuButton onClick={onOpenMenu} />
        <div>
          <h1 className="font-serif text-xl font-semibold tracking-tight text-text-primary sm:text-2xl">
            {getGreeting()}
          </h1>
          <p className="mt-0.5 text-sm text-text-secondary">{formatFullDate()}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle />
        <button
          type="button"
          onClick={onAddExpense}
          className="btn-press inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:brightness-110"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Add expense
        </button>
      </div>
    </header>
  )
}
