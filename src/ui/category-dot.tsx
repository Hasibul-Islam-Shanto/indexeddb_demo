type CategoryDotProps = {
  color: string
  size?: 'sm' | 'md'
}

const sizes = { sm: 'h-1.5 w-1.5', md: 'h-2 w-2' }

export function CategoryDot({ color, size = 'sm' }: CategoryDotProps) {
  return (
    <span
      className={`rounded-full ${sizes[size]}`}
      style={{ backgroundColor: color }}
      aria-hidden
    />
  )
}
