import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUp, BookOpen, Check, ChartColumn, ExternalLink, Plus, QrCode, ScanLine, UtensilsCrossed } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useStore } from '../store/useStore'
import { Button, ButtonLink } from '../components/ui/Button'
import { Sparkline } from '../components/Charts'
import { MenuActions, StatusBadge } from '../components/MenuCard'
import { CreateMenuModal } from '../components/CreateMenuModal'
import { LeafMark } from '../components/ui/Brand'
import { dailySeries, pctChange } from '../lib/analytics'
import { cn, compactNumber, publicMenuUrl, timeAgo } from '../lib/utils'
import { DEFAULT_THEME } from '../lib/seed'

export default function Dashboard() {
  const user = useStore((s) => s.user)!
  const restaurant = useStore((s) => s.restaurant)
  const menus = useStore((s) => s.menus)
  const [createOpen, setCreateOpen] = useState(false)

  const primary = menus.find((m) => m.status === 'published') ?? menus[0]
  const totalViews = menus.reduce((n, m) => n + m.views, 0)
  const totalDishes = menus.reduce((n, m) => n + m.categories.reduce((k, c) => k + c.dishes.length, 0), 0)
  const published = menus.filter((m) => m.status === 'published').length
  const series = useMemo(() => (primary ? dailySeries(primary, 14).map((d) => d.views) : []), [primary])
  const change = pctChange(series)

  const steps = [
    { label: 'Create your account', done: true, to: '/settings' },
    { label: 'Add restaurant details', done: !!(restaurant.address && restaurant.phone), to: '/settings' },
    { label: 'Add at least 3 dishes', done: totalDishes >= 3, to: primary ? `/menus/${primary.id}` : '/menus' },
    {
      label: 'Customize your design',
      done: !!primary && (primary.theme.preset !== DEFAULT_THEME.preset || primary.theme.font !== DEFAULT_THEME.font || totalViews > 0),
      to: primary ? `/menus/${primary.id}?tab=design` : '/menus',
    },
    { label: 'Publish your menu', done: published > 0, to: primary ? `/menus/${primary.id}` : '/menus' },
    { label: 'Download your QR code', done: published > 0 && totalViews > 0, to: primary ? `/menus/${primary.id}?tab=qr` : '/menus' },
  ]
  const doneCount = steps.filter((s) => s.done).length

  return (
    <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8 lg:py-10">
      {/* Greeting */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-2xl font-light text-ink sm:text-[28px]">Welcome back,</p>
          <h1 className="flex items-center gap-2 text-3xl font-bold text-ink sm:text-4xl">
            {restaurant.name} <LeafMark className="size-7 text-emerald-600" />
          </h1>
          <p className="mt-2 text-sm text-ink-soft">Hi {user.name.split(' ')[0]} — create, edit and manage your digital menu with ease.</p>
        </div>
        <Button size="lg" onClick={() => setCreateOpen(true)} iconRight={<Plus className="size-4" />}>
          Create New Menu
        </Button>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4 lg:grid-cols-4">
        <div className="relative col-span-3 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 p-5 text-white shadow-lift lg:col-span-1">
          <div className="flex items-start justify-between">
            <ChartColumn className="size-5 text-white/80" />
            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold backdrop-blur">
              <ArrowUp className="size-3" /> {Math.abs(change)}%
            </span>
          </div>
          <p className="mt-4 text-3xl font-bold">{compactNumber(totalViews)}</p>
          <p className="text-sm text-white/80">Menu views</p>
          <Sparkline data={series.length ? series : [0, 0]} className="absolute right-4 bottom-4 h-10 w-28 text-white/80" />
        </div>
        <Stat icon={ScanLine} label="QR scans" value={compactNumber(Math.round(totalViews * 0.71))} />
        <Stat icon={UtensilsCrossed} label="Dishes" value={totalDishes.toString()} />
        <Stat icon={BookOpen} label="Published" value={`${published}/${menus.length}`} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Menus */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Your Menus</h2>
            <Link to="/menus" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-900">
              See all <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {menus.length === 0 && (
              <div className="card flex flex-col items-center p-10 text-center">
                <BookOpen className="size-8 text-brand-400" />
                <p className="mt-3 font-semibold">No menus yet</p>
                <p className="mt-1 text-sm text-muted">Create your first digital menu in seconds.</p>
                <Button className="mt-5" onClick={() => setCreateOpen(true)} icon={<Plus className="size-4" />}>
                  Create menu
                </Button>
              </div>
            )}
            {menus.slice(0, 4).map((m) => {
              const dishes = m.categories.reduce((n, c) => n + c.dishes.length, 0)
              return (
                <div key={m.id} className="card flex items-center gap-4 p-3 pr-2 transition hover:shadow-lift">
                  <Link to={`/menus/${m.id}`} className="size-20 shrink-0 overflow-hidden rounded-xl bg-brand-100 sm:size-24">
                    {m.theme.cover && <img src={m.theme.cover} alt="" className="size-full object-cover" />}
                  </Link>
                  <Link to={`/menus/${m.id}`} className="min-w-0 flex-1">
                    <h3 className="truncate font-bold">{m.name}</h3>
                    <div className="mt-1">
                      <StatusBadge status={m.status} />
                    </div>
                    <p className="mt-1.5 truncate text-xs text-muted">
                      {dishes} dishes · {compactNumber(m.views)} views · edited {timeAgo(m.updatedAt)}
                    </p>
                  </Link>
                  <ButtonLink to={`/menus/${m.id}`} variant="secondary" size="sm" className="hidden sm:inline-flex">
                    Edit
                  </ButtonLink>
                  <MenuActions menu={m} />
                </div>
              )
            })}
          </div>
        </section>

        {/* Side column */}
        <aside className="space-y-6">
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold">Getting started</h2>
              <span className="text-xs font-semibold text-brand-700">
                {doneCount}/{steps.length}
              </span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-brand-100">
              <div className="h-full rounded-full bg-brand-700 transition-all" style={{ width: `${(doneCount / steps.length) * 100}%` }} />
            </div>
            <ul className="mt-4 space-y-1">
              {steps.map((s) => (
                <li key={s.label}>
                  <Link to={s.to} className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm transition hover:bg-brand-50">
                    <span
                      className={cn(
                        'flex size-5 shrink-0 items-center justify-center rounded-full border',
                        s.done ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-brand-200',
                      )}
                    >
                      {s.done && <Check className="size-3" strokeWidth={3} />}
                    </span>
                    <span className={cn(s.done ? 'text-muted line-through' : 'font-medium text-ink')}>{s.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {primary && (
            <div className="card p-5">
              <div className="flex items-center gap-4">
                <div className="rounded-xl border border-line bg-white p-2">
                  <QRCodeSVG value={publicMenuUrl(primary.slug)} size={84} fgColor="#1b1735" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-brand-700 uppercase">Your QR code</p>
                  <p className="mt-1 truncate font-bold">{primary.name}</p>
                  <a
                    href={`/m/${primary.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-xs text-muted hover:text-brand-700"
                  >
                    /m/{primary.slug} <ExternalLink className="size-3" />
                  </a>
                </div>
              </div>
              <ButtonLink to={`/menus/${primary.id}?tab=qr`} variant="secondary" className="mt-4 w-full" icon={<QrCode className="size-4" />}>
                Download QR
              </ButtonLink>
            </div>
          )}
        </aside>
      </div>

      <CreateMenuModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  )
}

function Stat({ icon: Icon, label, value }: { icon: typeof ChartColumn; label: string; value: string }) {
  return (
    <div className="card p-4 sm:p-5">
      <span className="flex size-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
        <Icon className="size-[18px]" />
      </span>
      <p className="mt-3 text-xl font-bold sm:mt-4 sm:text-2xl">{value}</p>
      <p className="truncate text-xs text-muted sm:text-sm">{label}</p>
    </div>
  )
}
