import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils'

interface WrapProps {
  label?: ReactNode
  required?: boolean
  hint?: ReactNode
  error?: string
  className?: string
  children: (id: string) => ReactNode
}

export function FieldWrap({ label, required, hint, error, className, children }: WrapProps) {
  const id = useId()
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="field-label">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}
      {children(id)}
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  )
}

type Common = { label?: ReactNode; hint?: ReactNode; error?: string; wrapClassName?: string }

export function Input({ label, hint, error, wrapClassName, className, required, ...rest }: Common & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FieldWrap label={label} hint={hint} error={error} required={required} className={wrapClassName}>
      {(id) => (
        <input
          id={id}
          aria-invalid={!!error}
          className={cn('input', error && 'border-red-300 focus:border-red-400 focus:ring-red-100', className)}
          {...rest}
        />
      )}
    </FieldWrap>
  )
}

export function Textarea({ label, hint, error, wrapClassName, className, required, ...rest }: Common & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <FieldWrap label={label} hint={hint} error={error} required={required} className={wrapClassName}>
      {(id) => <textarea id={id} rows={3} className={cn('input resize-none', className)} {...rest} />}
    </FieldWrap>
  )
}

export function Select({ label, hint, error, wrapClassName, className, required, children, ...rest }: Common & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <FieldWrap label={label} hint={hint} error={error} required={required} className={wrapClassName}>
      {(id) => (
        <div className="relative">
          <select id={id} className={cn('input appearance-none pr-9', className)} {...rest}>
            {children}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted" />
        </div>
      )}
    </FieldWrap>
  )
}

export function Switch({
  checked,
  onChange,
  label,
  size = 'md',
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label?: string
  size?: 'sm' | 'md'
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex shrink-0 items-center rounded-full transition-colors focus-visible:ring-4 focus-visible:ring-brand-100 focus-visible:outline-none',
        size === 'md' ? 'h-6 w-11' : 'h-5 w-9',
        checked ? 'bg-brand-700' : 'bg-slate-300',
      )}
    >
      <span
        className={cn(
          'inline-block rounded-full bg-white shadow transition-transform',
          size === 'md' ? 'size-5' : 'size-4',
          checked ? (size === 'md' ? 'translate-x-[22px]' : 'translate-x-[18px]') : 'translate-x-0.5',
        )}
      />
    </button>
  )
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  className,
}: {
  value: T
  onChange: (v: T) => void
  options: { value: T; label: ReactNode; icon?: ReactNode }[]
  className?: string
}) {
  return (
    <div className={cn('inline-flex rounded-full border border-line bg-white p-1', className)}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition',
            value === o.value ? 'bg-brand-700 text-white shadow' : 'text-ink-soft hover:text-ink',
          )}
        >
          {o.icon}
          {o.label}
        </button>
      ))}
    </div>
  )
}
