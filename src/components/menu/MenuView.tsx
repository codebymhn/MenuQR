import { useEffect, useMemo, useRef, useState } from 'react'
import { Clock, MapPin, Phone, Search, X } from 'lucide-react'
import type { Dish, Menu, Restaurant, DishTag } from '../../lib/types'
import { themeVars } from '../../lib/themes'
import { cn, formatPrice } from '../../lib/utils'
import { InstagramIcon, LeafMark, LogoMark } from '../ui/Brand'

export const TAG_META: Record<DishTag, { label: string; short: string }> = {
  vegetarian: { label: 'Vegetarian', short: 'V' },
  vegan: { label: 'Vegan', short: 'VG' },
  spicy: { label: 'Spicy', short: '🌶' },
  'gluten-free': { label: 'Gluten-free', short: 'GF' },
  new: { label: 'New', short: 'New' },
  chef: { label: "Chef's pick", short: '★' },
}

interface Props {
  menu: Menu
  restaurant: Restaurant
  /** Rendered inside a fixed-height frame (phone preview) — scrolls internally. */
  embedded?: boolean
  interactive?: boolean
}

export function MenuView({ menu, restaurant, embedded = false, interactive = true }: Props) {
  const { theme } = menu
  const scrollRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})
  const [active, setActive] = useState<string>('all')
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [selected, setSelected] = useState<Dish | null>(null)
  const currency = restaurant.currency

  const categories = useMemo(() => {
    const q = query.trim().toLowerCase()
    const cats = menu.categories.filter((c) => c.dishes.length > 0 || embedded)
    if (!q) return cats
    return cats
      .map((c) => ({ ...c, dishes: c.dishes.filter((d) => `${d.name} ${d.description}`.toLowerCase().includes(q)) }))
      .filter((c) => c.dishes.length)
  }, [menu.categories, query, embedded])

  // Scroll-spy: highlight the category currently in view
  useEffect(() => {
    const target: HTMLElement | Window = embedded && scrollRef.current ? scrollRef.current : window
    const onScroll = () => {
      const top = embedded && scrollRef.current ? scrollRef.current.getBoundingClientRect().top : 0
      let current = 'all'
      for (const c of categories) {
        const el = sectionRefs.current[c.id]
        if (el && el.getBoundingClientRect().top - top < 120) current = c.id
      }
      setActive(current)
    }
    target.addEventListener('scroll', onScroll, { passive: true })
    return () => target.removeEventListener('scroll', onScroll)
  }, [categories, embedded])

  const jumpTo = (id: string) => {
    if (id === 'all') {
      const t = embedded ? scrollRef.current : window
      t?.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const showImages = theme.showImages && theme.layout !== 'minimal'

  const content = (
    <div
      className="min-h-full bg-[var(--m-bg)] text-[var(--m-text)]"
      style={{ fontFamily: 'var(--m-body)' }}
    >
      <div
        className={cn(
          'mx-auto max-w-2xl bg-[var(--m-surface)] pb-6 sm:shadow-[0_0_60px_-20px_rgb(0_0_0/0.15)]',
          embedded ? 'min-h-full' : 'min-h-dvh',
        )}
      >
        {/* Cover + brand */}
        <header className="relative">
          {theme.cover ? (
            <div className={cn('relative w-full overflow-hidden', embedded ? 'h-44' : 'h-56 sm:h-72')}>
              <img src={theme.cover} alt="" className="size-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/10" />
              <svg className="absolute -bottom-px left-0 w-full text-[var(--m-surface)]" viewBox="0 0 400 40" preserveAspectRatio="none" aria-hidden>
                <path d="M0 40 V18 C 120 -6, 280 -6, 400 18 V40 Z" fill="currentColor" />
              </svg>
            </div>
          ) : (
            <div className="h-10" />
          )}
          <div className={cn('relative px-6 text-center', theme.cover ? '-mt-7' : 'pt-4')}>
            {restaurant.logo ? (
              <img
                src={restaurant.logo}
                alt={`${restaurant.name} logo`}
                className="mx-auto size-16 rounded-full border-4 border-[var(--m-surface)] bg-[var(--m-surface)] object-contain shadow-sm"
              />
            ) : (
              <LeafMark className="mx-auto size-12 text-[var(--m-text)]" />
            )}
            <h1
              className={cn('mt-1 leading-tight font-medium', embedded ? 'text-[32px]' : 'text-[40px]')}
              style={{ fontFamily: 'var(--m-heading)' }}
            >
              {restaurant.name || 'Your Restaurant'}
            </h1>
            {restaurant.tagline && (
              <p className="mt-0.5 text-[10px] font-semibold tracking-[0.28em] text-[var(--m-muted)] uppercase">{restaurant.tagline}</p>
            )}
            {menu.name && menu.name !== 'Main Menu' && (
              <p className="mt-2 text-sm text-[var(--m-muted)] italic" style={{ fontFamily: 'var(--m-heading)' }}>
                {menu.name}
              </p>
            )}
          </div>
        </header>

        {/* Sticky category nav */}
        {theme.showCategoryNav && menu.categories.length > 0 && (
          <nav className="sticky top-0 z-10 mt-5 border-b border-[var(--m-border)] bg-[var(--m-surface)]/90 backdrop-blur-md">
            {searchOpen ? (
              <div className="flex items-center gap-2 px-4 py-2.5">
                <Search className="size-4 text-[var(--m-muted)]" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search dishes…"
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--m-muted)]"
                />
                <button
                  onClick={() => {
                    setQuery('')
                    setSearchOpen(false)
                  }}
                  aria-label="Close search"
                  className="rounded-full p-1 text-[var(--m-muted)]"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <div className="scrollbar-none flex flex-1 gap-2 overflow-x-auto px-4 py-2.5">
                  {[{ id: 'all', name: 'All' }, ...categories].map((c) => (
                    <button
                      key={c.id}
                      onClick={() => interactive && jumpTo(c.id)}
                      className={cn(
                        'shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition',
                        active === c.id
                          ? 'bg-[var(--m-accent)] text-white shadow-sm'
                          : 'border border-[var(--m-border)] text-[var(--m-muted)] hover:text-[var(--m-text)]',
                      )}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
                {interactive && (
                  <button onClick={() => setSearchOpen(true)} aria-label="Search" className="mr-3 rounded-full p-2 text-[var(--m-muted)] hover:text-[var(--m-text)]">
                    <Search className="size-4" />
                  </button>
                )}
              </div>
            )}
          </nav>
        )}

        {/* Sections */}
        <main className="px-5">
          {categories.length === 0 && (
            <p className="py-16 text-center text-sm text-[var(--m-muted)]">
              {query ? `No dishes match “${query}”.` : 'This menu has no dishes yet.'}
            </p>
          )}
          {categories.map((cat) => (
            <section key={cat.id} ref={(el) => void (sectionRefs.current[cat.id] = el)} className="scroll-mt-16 pt-7">
              <h2 className="mb-4 flex items-center justify-center gap-3 text-[26px] font-medium" style={{ fontFamily: 'var(--m-heading)' }}>
                <span className="h-px w-8 bg-[var(--m-border)]" />
                {cat.name}
                <span className="h-px w-8 bg-[var(--m-border)]" />
              </h2>
              {cat.dishes.length === 0 && <p className="pb-2 text-center text-xs text-[var(--m-muted)] italic">No dishes in this category yet</p>}

              {theme.layout === 'cards' ? (
                <div className={cn('grid gap-3', !embedded && 'sm:grid-cols-2')}>
                  {cat.dishes.map((d) => (
                    <DishCard key={d.id} dish={d} currency={currency} showImage={showImages} onClick={() => interactive && setSelected(d)} />
                  ))}
                </div>
              ) : (
                <ul className="divide-y divide-[var(--m-border)]">
                  {cat.dishes.map((d) => (
                    <DishRow
                      key={d.id}
                      dish={d}
                      currency={currency}
                      showImage={showImages}
                      minimal={theme.layout === 'minimal'}
                      onClick={() => interactive && setSelected(d)}
                    />
                  ))}
                </ul>
              )}
            </section>
          ))}
        </main>

        {/* Footer */}
        <footer className="mx-5 mt-10 border-t border-[var(--m-border)] pt-6 text-center">
          <LeafMark className="mx-auto mb-4 size-7 text-[var(--m-muted)]" />
          <div className="space-y-2 text-xs text-[var(--m-muted)]">
            {restaurant.address && (
              <p className="flex items-center justify-center gap-1.5">
                <MapPin className="size-3.5" /> {restaurant.address}
              </p>
            )}
            {restaurant.hours && (
              <p className="flex items-center justify-center gap-1.5">
                <Clock className="size-3.5" /> {restaurant.hours}
              </p>
            )}
            {restaurant.phone && (
              <p className="flex items-center justify-center gap-1.5">
                <Phone className="size-3.5" /> {restaurant.phone}
              </p>
            )}
            {restaurant.instagram && (
              <p className="flex items-center justify-center gap-1.5">
                <InstagramIcon className="size-3.5" /> {restaurant.instagram}
              </p>
            )}
          </div>
          <p className="mt-6 inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-[var(--m-muted)] uppercase opacity-70">
            Powered by <LogoMark className="size-3.5" /> MENUQR
          </p>
        </footer>
      </div>
    </div>
  )

  return (
    <div className={cn('relative bg-[var(--m-bg)]', embedded ? 'h-full overflow-hidden' : 'min-h-dvh')} style={themeVars(theme)}>
      {embedded ? (
        <div ref={scrollRef} className="scrollbar-none h-full overflow-y-auto overscroll-contain">
          {content}
        </div>
      ) : (
        content
      )}
      {selected && <DishSheet dish={selected} currency={currency} embedded={embedded} onClose={() => setSelected(null)} />}
    </div>
  )
}

function Tags({ tags }: { tags: DishTag[] }) {
  if (!tags.length) return null
  return (
    <div className="mt-1.5 flex flex-wrap gap-1">
      {tags.map((t) => (
        <span
          key={t}
          className="rounded-full bg-[color-mix(in_srgb,var(--m-accent)_12%,transparent)] px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-[var(--m-accent)] uppercase"
        >
          {TAG_META[t].label}
        </span>
      ))}
    </div>
  )
}

function DishRow({
  dish,
  currency,
  showImage,
  minimal,
  onClick,
}: {
  dish: Dish
  currency: Restaurant['currency']
  showImage: boolean
  minimal: boolean
  onClick: () => void
}) {
  return (
    <li>
      <button onClick={onClick} className={cn('flex w-full items-start gap-3.5 py-3.5 text-left', !dish.available && 'opacity-55')}>
        {showImage && dish.image && (
          <img src={dish.image} alt="" loading="lazy" className="size-[68px] shrink-0 rounded-xl object-cover shadow-sm" />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <h3 className={cn('font-semibold', minimal ? 'text-[15px]' : 'text-sm')}>{dish.name}</h3>
            {minimal && <span className="mb-1 flex-1 border-b border-dotted border-[var(--m-muted)]/50" />}
            <span className="ml-auto shrink-0 text-sm font-bold">{formatPrice(dish.price, currency)}</span>
          </div>
          {dish.description && <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-[var(--m-muted)]">{dish.description}</p>}
          <div className="flex items-center gap-2">
            <Tags tags={dish.tags} />
            {!dish.available && (
              <span className="mt-1.5 rounded-full border border-[var(--m-border)] px-1.5 py-0.5 text-[9px] font-bold tracking-wide uppercase">Sold out</span>
            )}
          </div>
        </div>
      </button>
    </li>
  )
}

function DishCard({ dish, currency, showImage, onClick }: { dish: Dish; currency: Restaurant['currency']; showImage: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'overflow-hidden rounded-2xl border border-[var(--m-border)] bg-[var(--m-surface)] text-left shadow-sm transition hover:shadow-md',
        !dish.available && 'opacity-55',
      )}
    >
      {showImage && dish.image && <img src={dish.image} alt="" loading="lazy" className="aspect-[16/10] w-full object-cover" />}
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold">{dish.name}</h3>
          <span className="text-sm font-bold text-[var(--m-accent)]">{formatPrice(dish.price, currency)}</span>
        </div>
        {dish.description && <p className="mt-1 line-clamp-2 text-xs text-[var(--m-muted)]">{dish.description}</p>}
        <div className="flex items-center gap-2">
          <Tags tags={dish.tags} />
          {!dish.available && <span className="mt-1.5 text-[9px] font-bold uppercase">Sold out</span>}
        </div>
      </div>
    </button>
  )
}

function DishSheet({ dish, currency, embedded, onClose }: { dish: Dish; currency: Restaurant['currency']; embedded: boolean; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className={cn('inset-0 z-30 flex items-end justify-center', embedded ? 'absolute' : 'fixed sm:items-center sm:p-6')}>
      <div className="animate-fade-in absolute inset-0 bg-black/45" onClick={onClose} />
      <div className="animate-slide-up relative w-full max-w-md overflow-hidden rounded-t-3xl bg-[var(--m-surface)] text-[var(--m-text)] shadow-2xl sm:rounded-3xl" style={{ fontFamily: 'var(--m-body)' }}>
        {dish.image && <img src={dish.image} alt="" className="aspect-[4/3] w-full object-cover" />}
        <button onClick={onClose} aria-label="Close" className="absolute top-3 right-3 rounded-full bg-white/90 p-2 text-gray-800 shadow">
          <X className="size-4" />
        </button>
        <div className="p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-2xl font-medium" style={{ fontFamily: 'var(--m-heading)' }}>
              {dish.name}
            </h3>
            <span className="pt-1 text-lg font-bold text-[var(--m-accent)]">{formatPrice(dish.price, currency)}</span>
          </div>
          {dish.description && <p className="mt-2 text-sm leading-relaxed text-[var(--m-muted)]">{dish.description}</p>}
          <Tags tags={dish.tags} />
          {!dish.available && <p className="mt-4 rounded-xl bg-[var(--m-bg)] px-3 py-2 text-xs font-semibold">Currently unavailable</p>}
        </div>
      </div>
    </div>
  )
}
