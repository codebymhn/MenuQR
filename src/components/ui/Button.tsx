import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { cn } from '../../lib/utils'

type Variant = 'primary' | 'dark' | 'secondary' | 'ghost' | 'danger' | 'white'
type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-150 select-none whitespace-nowrap disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-200 active:scale-[0.98]'

const variants: Record<Variant, string> = {
  primary: 'bg-brand-800 text-white shadow-[0_8px_20px_-8px_rgb(70_48_158/0.7)] hover:bg-brand-900',
  dark: 'bg-ink text-white shadow-[0_8px_20px_-8px_rgb(27_23_53/0.6)] hover:bg-black',
  secondary: 'bg-white text-ink border border-line hover:border-brand-200 hover:bg-brand-50',
  ghost: 'text-ink-soft hover:bg-brand-50 hover:text-ink',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  white: 'bg-white text-brand-800 hover:bg-brand-50 shadow-soft',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-[13px]',
  md: 'h-11 px-5 text-sm',
  lg: 'h-13 px-7 text-[15px] rounded-2xl',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  icon?: ReactNode
  iconRight?: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', icon, iconRight, className, children, type = 'button', ...rest }, ref) => (
    <button ref={ref} type={type} className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {icon}
      {children}
      {iconRight}
    </button>
  ),
)
Button.displayName = 'Button'

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  className,
  children,
  ...rest
}: LinkProps & { variant?: Variant; size?: Size; icon?: ReactNode; iconRight?: ReactNode }) {
  return (
    <Link className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {icon}
      {children}
      {iconRight}
    </Link>
  )
}

export function IconButton({
  className,
  label,
  tone = 'default',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string; tone?: 'default' | 'danger' }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted transition hover:bg-brand-50 focus-visible:ring-4 focus-visible:ring-brand-100 focus-visible:outline-none disabled:opacity-40',
        tone === 'danger' ? 'hover:bg-red-50 hover:text-red-600' : 'hover:text-brand-700',
        className,
      )}
      {...rest}
    />
  )
}
