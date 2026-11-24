import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { useStore } from '../store/useStore'
import { Button } from '../components/ui/Button'
import { MenuCard } from '../components/MenuCard'
import { CreateMenuModal } from '../components/CreateMenuModal'
import { cn } from '../lib/utils'

type Filter = 'all' | 'published' | 'draft'

export default function Menus() {
  const menus = useStore((s) => s.menus)
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState<Filter>('all')
  const [q, setQ] = useState('')

  const list = menus
    .filter((m) => filter === 'all' || m.status === filter)
    .filter((m) => m.name.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => b.updatedAt - a.updatedAt)

  return (
    <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8 lg:py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Menus</h1>
          <p className="mt-1 text-sm text-muted">Create separate menus for lunch, dinner, drinks or special events.</p>
        </div>
        <Button onClick={() => setOpen(true)} icon={<Plus className="size-4" />}>
          New Menu
        </Button>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex rounded-xl border border-line bg-white p-1">
          {(['all', 'published', 'draft'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'rounded-lg px-4 py-1.5 text-sm font-semibold capitalize transition',
                filter === f ? 'bg-brand-100 text-brand-900' : 'text-muted hover:text-ink',
              )}
            >
              {f} <span className="ml-1 text-xs opacity-60">{f === 'all' ? menus.length : menus.filter((m) => m.status === f).length}</span>
            </button>
          ))}
        </div>
        <label className="relative sm:w-64">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
          <input className="input pl-9" placeholder="Search menus" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((m) => (
          <MenuCard key={m.id} menu={m} />
        ))}
        <button
          onClick={() => setOpen(true)}
          className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-brand-200 bg-white/40 text-brand-700 transition hover:border-brand-400 hover:bg-white"
        >
          <span className="flex size-12 items-center justify-center rounded-full bg-brand-100">
            <Plus className="size-6" />
          </span>
          <span className="font-semibold">Create new menu</span>
        </button>
      </div>
      {list.length === 0 && q && <p className="mt-6 text-center text-sm text-muted">No menus match “{q}”.</p>}

      <CreateMenuModal open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
