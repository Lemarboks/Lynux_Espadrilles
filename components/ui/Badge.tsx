interface BadgeProps {
  children: React.ReactNode
  variant?: 'clay' | 'ink' | 'sand'
}

export default function Badge({ children, variant = 'clay' }: BadgeProps) {
  const variants = {
    clay: 'bg-clay/10 text-clay-dark',
    ink: 'bg-ink/10 text-ink',
    sand: 'bg-sand text-ink-mid',
  }

  return (
    <span className={`font-dm text-[10px] tracking-[0.15em] uppercase font-medium px-3 py-1 ${variants[variant]}`}>
      {children}
    </span>
  )
}
