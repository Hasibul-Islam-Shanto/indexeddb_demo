type LoadingStateProps = {
  message?: string
}

export function LoadingState({ message = 'Loading…' }: LoadingStateProps) {
  return (
    <div className="rounded-xl border border-border bg-surface px-6 py-16 text-center">
      <p className="text-sm text-text-secondary">{message}</p>
    </div>
  )
}
