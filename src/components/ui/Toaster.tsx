import { CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { useToast } from '../../store/useToast'
import { cn } from '../../lib/utils'

export function Toaster() {
  const { toasts, dismiss } = useToast()
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-20 z-[60] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:items-end lg:bottom-8">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className="animate-pop pointer-events-auto flex items-center gap-3 rounded-2xl border border-line bg-white py-3 pr-3 pl-4 text-sm font-medium text-ink shadow-lift"
        >
          {t.kind === 'success' && <CheckCircle2 className="size-5 shrink-0 fill-emerald-500 text-white" />}
          {t.kind === 'error' && <XCircle className="size-5 shrink-0 fill-red-500 text-white" />}
          {t.kind === 'info' && <Info className="size-5 shrink-0 fill-brand-600 text-white" />}
          <span className={cn('max-w-xs')}>{t.message}</span>
          <button onClick={() => dismiss(t.id)} className="ml-2 rounded-md p-1 text-muted hover:bg-brand-50 hover:text-ink" aria-label="Dismiss">
            <X className="size-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
