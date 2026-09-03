import { PageHeader } from '../ui/page-header'

export function SettingsView() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Preferences for this ledger. Changes stay on this device."
      />

      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <div>
            <p className="text-sm font-medium text-text-primary">Currency</p>
            <p className="mt-0.5 text-xs text-text-muted">
              Display format for amounts
            </p>
          </div>
          <span className="font-mono text-sm text-text-secondary">USD</span>
        </div>

        <hr className="divider-perforated mx-4" />

        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <div>
            <p className="text-sm font-medium text-text-primary">Period</p>
            <p className="mt-0.5 text-xs text-text-muted">
              Summary window for totals and trends
            </p>
          </div>
          <span className="text-sm text-text-secondary">This month</span>
        </div>
      </div>

      <p className="text-center font-mono text-[11px] text-text-muted">
        Ledger · personal expense tracker
      </p>
    </div>
  )
}
