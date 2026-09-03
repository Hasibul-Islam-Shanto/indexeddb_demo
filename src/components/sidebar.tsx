import {
  LayoutDashboard,
  Settings,
  Tags,
  X,
} from 'lucide-react'
import type { NavPage } from '../types'

type SidebarProps = {
  current: NavPage
  onNavigate: (page: NavPage) => void
  mobileOpen: boolean
  onCloseMobile: () => void
}

const NAV: { id: NavPage; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'categories', label: 'Categories', icon: Tags },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export function Sidebar({
  current,
  onNavigate,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-text-primary/20 backdrop-blur-[2px] lg:hidden animate-backdrop-in"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-surface transition-transform duration-200 ease-out lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-xl font-semibold tracking-tight text-text-primary">
              Ledger
            </span>
            <span className="font-mono text-[10px] text-text-muted">v1</span>
          </div>
          <button
            type="button"
            className="btn-press rounded-lg p-1.5 text-text-secondary hover:bg-surface-alt lg:hidden"
            onClick={onCloseMobile}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3 pt-2" aria-label="Main">
          {NAV.map(({ id, label, icon: Icon }) => {
            const active = current === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  onNavigate(id)
                  onCloseMobile()
                }}
                className={`btn-press flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                  active
                    ? 'bg-accent/10 text-accent'
                    : 'text-text-secondary hover:bg-surface-alt hover:text-text-primary'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                {label}
              </button>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
