import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../hooks/use-theme'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="btn-press relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-text-secondary hover:bg-surface-alt hover:text-text-primary"
    >
      <Sun
        className={`theme-icon absolute h-4 w-4 ${
          isDark
            ? 'pointer-events-none scale-75 opacity-0'
            : 'scale-100 opacity-100'
        }`}
        aria-hidden
      />
      <Moon
        className={`theme-icon absolute h-4 w-4 ${
          isDark
            ? 'scale-100 opacity-100'
            : 'pointer-events-none scale-75 opacity-0'
        }`}
        aria-hidden
      />
    </button>
  )
}
