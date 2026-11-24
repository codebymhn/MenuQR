import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, Clock, Eye, ScanLine, Smartphone, Info } from 'lucide-react'
import { useStore } from '../store/useStore'
import { AreaChart, BarChart } from '../components/Charts'
import { Select } from '../components/ui/Field'
import { dailySeries, deviceSplit, hourlyDistribution, pctChange, sum, topDishes } from '../lib/analytics'
import { cn, compactNumber, formatPrice } from '../lib/utils'

const RANGES = [
  { id: 7, label: '7 days' },
  { id: 30, label: '30 days' },
  { id: 90, label: '90 days' },
]

export default function Analytics() {
  const menus = useStore((s) => s.menus)
  const currency = useStore((s) => s.restaurant.currency)
  const [menuId, setMenuId] = useState(menus.find((m) => m.status === 'published')?.id ?? menus[0]?.id)
  const [range, setRange] = useState(30)
  const menu = menus.find((m) => m.id === menuId) ?? menus[0]

  const data = useMemo(() => (menu ? dailySeries(menu, range) : []), [menu, range])
  const hours = useMemo(() => (menu ? hourlyDistribution(menu) : []), [menu])
  const top = useMemo(() => (menu ? topDishes(menu) : []), [menu])
  const devices = useMemo(() => (menu ? deviceSplit(menu) : []), [menu])

  if (!menu) return <div className="p-10 text-center text-muted">Create a menu to see analytics.</div>

  const views = data.map((d) => d.views)
  const scans = data.map((d) => d.scans)
  const peak = hours.reduce((a, b) => (b.value > a.value ? b : a), hours[0])
  const labels = data.map((d) => d.date.toLocaleDateString('en', { month: 'short', day: 'numeric' }))
  const maxTop = Math.max(...top.map((t) => t.views), 1)

  return (
    <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8 lg:py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="mt-1 text-sm text-muted">See how customers engage with your menu.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={menu.id} onChange={(e) => setMenuId(e.target.value)} wrapClassName="w-48">
            {menus.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </Select>
          <div className="inline-flex rounded-xl border border-line bg-white p-1">
            {RANGES.map((r) => (
              <button
                key={r.id}
                onClick={() => setRange(r.id)}
                className={cn('rounded-lg px-3 py-1.5 text-sm font-semibold transition', range === r.id ? 'bg-brand-100 text-brand-900' : 'text-muted hover:text-ink')}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-2.5 text-xs text-brand-900">
        <Info className="size-4 shrink-0" /> Demo data — real tracking will be connected once the MENUQR backend is live.
      </div>

      {menu.status !== 'published' ? (
        <div className="card mt-6 p-12 text-center">
          <p className="font-semibold">“{menu.name}” isn’t published yet</p>
          <p className="mt-1 text-sm text-muted">Publish the menu to start collecting views and scans.</p>
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Kpi icon={Eye} label="Menu views" value={compactNumber(sum(views))} change={pctChange(views)} />
            <Kpi icon={ScanLine} label="QR scans" value={compactNumber(sum(scans))} change={pctChange(scans)} />
            <Kpi icon={Clock} label="Avg. time on menu" value="2m 48s" change={6} />
            <Kpi icon={Clock} label="Peak hour" value={`${peak.hour}:00`} />
          </div>

          <div className="card mt-6 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold">Views & scans</h2>
              <div className="flex items-center gap-4 text-xs text-muted">
                <span className="flex items-center gap-1.5">
                  <span className="h-0.5 w-4 rounded bg-brand-700" /> Views
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-0.5 w-4 rounded border-t-2 border-dashed border-brand-300" /> Scans
                </span>
              </div>
            </div>
            <AreaChart data={views} secondary={scans} labels={labels} />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="card p-5">
              <h2 className="font-bold">Most viewed dishes</h2>
              <ul className="mt-4 space-y-3">
                {top.map((t, i) => (
                  <li key={t.dish.id} className="flex items-center gap-3">
                    <span className="w-4 text-xs font-bold text-muted">{i + 1}</span>
                    {t.dish.image ? (
                      <img src={t.dish.image} alt="" className="size-10 rounded-lg object-cover" />
                    ) : (
                      <span className="size-10 rounded-lg bg-brand-50" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-2 text-sm">
                        <span className="truncate font-semibold">{t.dish.name}</span>
                        <span className="text-muted">{t.views.toLocaleString()}</span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-brand-50">
                        <div className="h-full rounded-full bg-brand-600" style={{ width: `${(t.views / maxTop) * 100}%` }} />
                      </div>
                      <p className="mt-1 text-[11px] text-muted">
                        {t.category} · {formatPrice(t.dish.price, currency)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <div className="card p-5">
                <h2 className="font-bold">Busiest hours</h2>
                <p className="text-xs text-muted">Scans by hour of the day</p>
                <BarChart className="mt-4" data={hours.map((h) => ({ label: String(h.hour), value: h.value }))} />
              </div>
              <div className="card p-5">
                <h2 className="flex items-center gap-2 font-bold">
                  <Smartphone className="size-4 text-brand-700" /> Devices
                </h2>
                <div className="mt-4 flex h-3 overflow-hidden rounded-full">
                  {devices.map((d, i) => (
                    <div key={d.label} className={['bg-brand-700', 'bg-brand-400', 'bg-brand-200'][i]} style={{ width: `${d.value}%` }} />
                  ))}
                </div>
                <div className="mt-3 flex justify-between text-xs">
                  {devices.map((d, i) => (
                    <span key={d.label} className="flex items-center gap-1.5 text-ink-soft">
                      <span className={cn('size-2 rounded-full', ['bg-brand-700', 'bg-brand-400', 'bg-brand-200'][i])} />
                      {d.label} <b>{d.value}%</b>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function Kpi({ icon: Icon, label, value, change }: { icon: typeof Eye; label: string; value: string; change?: number }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <span className="flex size-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
          <Icon className="size-[18px]" />
        </span>
        {change !== undefined && (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold',
              change >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600',
            )}
          >
            {change >= 0 ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
            {Math.abs(change)}%
          </span>
        )}
      </div>
      <p className="mt-4 text-2xl font-bold">{value}</p>
      <p className="text-sm text-muted">{label}</p>
    </div>
  )
}
