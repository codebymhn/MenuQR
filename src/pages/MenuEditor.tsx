import { useEffect, useState } from 'react'
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Copy, Eye, LayoutGrid, Link2, Maximize2, Palette, QrCode, Settings, Smartphone, X, EyeOff, ExternalLink } from 'lucide-react'
import { useMenu, useStore } from '../store/useStore'
import { toast } from '../store/useToast'
import { cn, copyText, publicMenuUrl, timeAgo } from '../lib/utils'
import { Button } from '../components/ui/Button'
import { Segmented } from '../components/ui/Field'
import { PhoneFrame } from '../components/menu/PhoneFrame'
import { MenuView } from '../components/menu/MenuView'
import { ContentTab } from '../components/editor/ContentTab'
import { DesignTab } from '../components/editor/DesignTab'
import { SettingsTab } from '../components/editor/SettingsTab'
import { QrTab } from '../components/editor/QrTab'
import { StatusBadge } from '../components/MenuCard'

const TABS = [
  { id: 'content', label: 'Content', icon: LayoutGrid },
  { id: 'design', label: 'Design', icon: Palette },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'qr', label: 'QR Code', icon: QrCode },
] as const
type TabId = (typeof TABS)[number]['id']

function useNow(interval = 15000) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), interval)
    return () => clearInterval(t)
  }, [interval])
  return now
}

export default function MenuEditor() {
  const { id } = useParams()
  const menu = useMenu(id)
  const restaurant = useStore((s) => s.restaurant)
  const setStatus = useStore((s) => s.setStatus)
  const [params, setParams] = useSearchParams()
  const tab = (TABS.some((t) => t.id === params.get('tab')) ? params.get('tab') : 'content') as TabId
  const [previewMode, setPreviewMode] = useState<'phone' | 'full'>('phone')
  const [mobilePreview, setMobilePreview] = useState(false)
  const now = useNow()

  if (!menu) return <Navigate to="/menus" replace />

  const url = publicMenuUrl(menu.slug)
  const setTab = (t: TabId) => setParams(t === 'content' ? {} : { tab: t }, { replace: true })

  const publish = () => {
    setStatus(menu.id, 'published')
    toast('Menu published — it’s live! 🎉')
  }

  const preview = <MenuView menu={menu} restaurant={restaurant} embedded />

  return (
    <div className="mx-auto max-w-[1400px] px-4 pt-4 pb-10 sm:px-8 lg:pt-6">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3">
        <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-lg py-2 text-sm font-medium text-ink-soft hover:text-ink">
          <ArrowLeft className="size-4" /> <span className="hidden sm:inline">Back to Dashboard</span>
          <span className="sm:hidden">Back</span>
        </Link>
        <div className="flex items-center gap-2">
          {menu.status === 'published' ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                icon={<EyeOff className="size-4" />}
                onClick={() => {
                  setStatus(menu.id, 'draft')
                  toast('Menu unpublished', 'info')
                }}
              >
                <span className="hidden sm:inline">Unpublish</span>
              </Button>
              <a
                href={`/m/${menu.slug}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand-800 px-5 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgb(70_48_158/0.7)] transition hover:bg-brand-900"
              >
                View Live <ExternalLink className="size-4" />
              </a>
            </>
          ) : (
            <Button onClick={publish} iconRight={<ArrowRight className="size-4" />}>
              Publish Menu
            </Button>
          )}
        </div>
      </div>

      {/* Header */}
      <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="size-16 shrink-0 overflow-hidden rounded-2xl bg-brand-100 shadow-soft sm:size-[88px]">
            {menu.theme.cover && <img src={menu.theme.cover} alt="" className="size-full object-cover" />}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <h1 className="truncate text-2xl font-bold sm:text-3xl">{restaurant.name}</h1>
              <span className="inline-flex items-center gap-1.5 text-sm text-muted">
                <span className="size-2 rounded-full bg-emerald-500" /> Saved {timeAgo(menu.updatedAt, now)}
              </span>
            </div>
            <p className="mt-1 flex items-center gap-2 text-sm text-ink-soft sm:text-base">
              {menu.name}
              {restaurant.cuisine && <span className="hidden text-muted sm:inline">· {restaurant.cuisine}</span>}
              <StatusBadge status={menu.status} />
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`/m/${menu.slug}`}
            target="_blank"
            rel="noreferrer"
            className="flex min-w-0 flex-1 items-center gap-2.5 rounded-xl border border-line bg-white/70 px-3 py-2.5 text-sm text-ink-soft transition hover:border-brand-200 lg:flex-none"
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
              <Link2 className="size-4" />
            </span>
            <span className="truncate">{url.replace(/^https?:\/\//, '')}</span>
          </a>
          <Button
            variant="secondary"
            icon={<Copy className="size-4" />}
            onClick={async () => {
              await copyText(url)
              toast('Link copied to clipboard')
            }}
          >
            Copy
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_440px]">
        <div className="min-w-0">
          {/* Tabs */}
          <div className="scrollbar-none -mx-4 mb-5 flex overflow-x-auto border-b border-line px-4 sm:mx-0 sm:px-0">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  'relative flex shrink-0 items-center gap-2 px-5 py-3.5 text-sm font-medium transition',
                  tab === t.id ? 'text-brand-900' : 'text-ink-soft hover:text-ink',
                )}
              >
                <t.icon className={cn('size-[18px]', tab === t.id ? 'text-brand-700' : 'text-muted')} strokeWidth={1.8} />
                {t.label}
                {tab === t.id && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-brand-700" />}
              </button>
            ))}
          </div>

          <div key={tab} className="animate-fade-in">
            {tab === 'content' && <ContentTab menu={menu} />}
            {tab === 'design' && <DesignTab menu={menu} />}
            {tab === 'settings' && <SettingsTab menu={menu} />}
            {tab === 'qr' && <QrTab menu={menu} />}
          </div>
        </div>

        {/* Live preview (desktop) */}
        <aside className="hidden xl:block">
          <div className="sticky top-6 flex flex-col items-center rounded-3xl border border-white/80 bg-gradient-to-b from-brand-100/80 to-brand-50/40 px-6 pt-5 pb-8 shadow-soft">
            <Segmented
              value={previewMode}
              onChange={(v) => {
                if (v === 'full') window.open(`/m/${menu.slug}`, '_blank')
                else setPreviewMode(v)
              }}
              options={[
                { value: 'phone', label: 'Preview', icon: <Eye className="size-3.5" /> },
                { value: 'full', label: 'Full Screen', icon: <Maximize2 className="size-3.5" /> },
              ]}
            />
            <PhoneFrame className="mt-5 w-[310px]">{preview}</PhoneFrame>
            <p className="mt-5 flex items-center gap-2 text-xs text-muted">
              <Eye className="size-3.5" /> This is how your menu will look to your customers.
            </p>
          </div>
        </aside>
      </div>

      {/* Mobile preview FAB + sheet */}
      <button
        onClick={() => setMobilePreview(true)}
        className="fixed right-5 bottom-24 z-20 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3.5 text-sm font-semibold text-white shadow-lift xl:hidden"
      >
        <Smartphone className="size-4" /> Preview
      </button>
      {mobilePreview && (
        <div className="animate-fade-in fixed inset-0 z-50 flex flex-col bg-ink/60 backdrop-blur-sm xl:hidden">
          <div className="flex items-center justify-between px-5 py-3 text-white">
            <span className="text-sm font-semibold">Live preview</span>
            <button onClick={() => setMobilePreview(false)} className="rounded-full bg-white/15 p-2" aria-label="Close preview">
              <X className="size-5" />
            </button>
          </div>
          <div className="animate-slide-up mx-auto w-full max-w-md flex-1 overflow-hidden rounded-t-3xl bg-white">{preview}</div>
        </div>
      )}
    </div>
  )
}
