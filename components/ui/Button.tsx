import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export default function Button({
  variant = 'filled',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const base = 'font-dm font-medium tracking-wide transition-all duration-300 inline-flex items-center justify-center'

  const variants = {
    filled: 'bg-clay hover:bg-clay-dark text-cream',
    outline: 'border border-ink text-ink hover:bg-ink hover:text-cream',
    ghost: 'text-ink hover:text-clay',
  }

  const sizes = {
    sm: 'text-xs px-5 py-2',
    md: 'text-sm px-7 py-3',
    lg: 'text-sm px-10 py-4',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
