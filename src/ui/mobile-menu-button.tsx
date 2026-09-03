import { Menu } from 'lucide-react'
import { IconButton } from './icon-button'

type MobileMenuButtonProps = {
  onClick: () => void
}

export function MobileMenuButton({ onClick }: MobileMenuButtonProps) {
  return (
    <IconButton onClick={onClick} label="Open menu" className="lg:hidden">
      <Menu className="h-4 w-4" />
    </IconButton>
  )
}
