import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Copy, ExternalLink, MoreVertical, Pencil, QrCode, Trash2, Eye } from 'lucide-react'
import type { Menu } from '../lib/types'
import { cn, compactNumber, timeAgo } from '../lib/utils'
import { useStore } from '../store/useStore'
import { toast } from '../store/useToast'
import { ConfirmDialog } from './ui/Modal'

export function StatusBadge({ status }: { status: Menu['status'] }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold',
        status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700',
      )}
    >
      <span className={cn('size-1.5 rounded-full', status === 'published' ? 'bg-emerald-500' : 'bg-amber-500')} />
      {status === 'published' ? 'Published' : 'Draft'}
    </span>
  )
}

export function MenuActions({ menu, className }: { menu: Menu; className?: string }) {
  const [open, setOpen] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const duplicateMenu = useStore((s) => s.duplicateMenu)
  const deleteMenu = useStore((s) => s.deleteMenu)

  useEffect(() => {
    const close = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const item = 'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink-soft hover:bg-brand-50 hover:text-ink'

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        onClick={(e) => {
          e.preventDefault()
          setOpen((v) => !v)
        }}
        className="rounded-lg p-2 text-muted transition hover:bg-brand-50 hover:text-ink"
        aria-label="Menu actions"
      >
        <MoreVertical className="size-[18px]" />
      </button>
      {open && (
        <div className="animate-pop absolute top-full right-0 z-20 mt-1 w-48 rounded-xl border border-line bg-white p-1 shadow-lift">
          <button className={item} onClick={() => navigate(`/menus/${menu.id}`)}>
            <Pencil className="size-4" /> Edit menu
          </button>
          <a className={item} href={`/m/${menu.slug}`} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
            <ExternalLink className="size-4" /> {menu.status === 'published' ? 'View live' : 'Preview'}
          </a>
          <button className={item} onClick={() => navigate(`/menus/${menu.id}?tab=qr`)}>
            <QrCode className="size-4" /> QR code
          </button>
          <button
            className={item}
            onClick={() => {
              const id = duplicateMenu(menu.id)
              setOpen(false)
              toast('Menu duplicated')
              if (id) navigate(`/menus/${id}`)
            }}
          >
            <Copy className="size-4" /> Duplicate
          </button>
          <div className="my-1 h-px bg-line" />
          <button
            className={cn(item, 'text-red-600 hover:bg-red-50 hover:text-red-700')}
            onClick={() => {
              setOpen(false)
              setConfirm(true)
            }}
          >
            <Trash2 className="size-4" /> Delete
          </button>
        </div>
      )}
      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={() => {
          deleteMenu(menu.id)
          toast('Menu deleted')
        }}
        title="Delete this menu?"
        message={
          <>
            <b>{menu.name}</b> and all its dishes will be permanently removed. Printed QR codes for this menu will stop working.
          </>
        }
      />
    </div>
  )
}

export function MenuCard({ menu }: { menu: Menu }) {
  const dishes = menu.categories.reduce((n, c) => n + c.dishes.length, 0)
  return (
    <div className="card group overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lift">
      <Link to={`/menus/${menu.id}`} className="relative block aspect-[16/9] overflow-hidden bg-brand-100">
        {menu.theme.cover ? (
          <img src={menu.theme.cover} alt="" className="size-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex size-full items-center justify-center text-brand-300">
            <QrCode className="size-10" />
          </div>
        )}
        <span className="absolute top-3 left-3">
          <StatusBadge status={menu.status} />
        </span>
      </Link>
      <div className="flex items-start gap-2 p-4">
        <Link to={`/menus/${menu.id}`} className="min-w-0 flex-1">
          <h3 className="truncate font-bold text-ink">{menu.name}</h3>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
            <span>{menu.categories.length} categories</span>
            <span>{dishes} dishes</span>
            <span className="inline-flex items-center gap-1">
              <Eye className="size-3" /> {compactNumber(menu.views)}
            </span>
          </p>
          <p className="mt-2 text-xs text-muted">Edited {timeAgo(menu.updatedAt)}</p>
        </Link>
        <MenuActions menu={menu} />
      </div>
    </div>
  )
}
