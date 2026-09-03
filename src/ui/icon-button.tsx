import type { ReactNode } from 'react'

type IconButtonProps = {
  onClick: () => void
  label: string
  children: ReactNode
  className?: string
}

export function IconButton({
  onClick,
  label,
  children,
  className = '',
}: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`btn-press flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-text-secondary hover:bg-surface-alt ${className}`}
    >
      {children}
    </button>
  )
}
