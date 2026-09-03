type PageHeaderProps = {
  title: string
  description: string
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div>
      <h2 className="font-serif text-2xl font-semibold text-text-primary">
        {title}
      </h2>
      <p className="mt-1 text-sm text-text-secondary">{description}</p>
    </div>
  )
}
