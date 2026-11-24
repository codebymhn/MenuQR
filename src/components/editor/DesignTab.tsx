import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import type { FontPairId, Menu, MenuTheme, ThemePresetId } from '../../lib/types'
import { ACCENT_SWATCHES, FONT_PAIRS, LAYOUTS, THEME_PRESETS } from '../../lib/themes'
import { useStore } from '../../store/useStore'
import { cn } from '../../lib/utils'
import { ImageUpload } from '../ui/ImageUpload'
import { Switch } from '../ui/Field'

const SAMPLE_COVERS = ['/images/hero-dish.jpg', '/images/dishes/burrata.jpg', '/images/dishes/risotto.jpg', '/images/dishes/creme-brulee.jpg', '/images/dishes/lemonade.jpg']

export function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="card p-5">
      <h3 className="font-bold">{title}</h3>
      {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  )
}

export function DesignTab({ menu }: { menu: Menu }) {
  const updateMenu = useStore((s) => s.updateMenu)
  const t = menu.theme
  const set = (patch: Partial<MenuTheme>) => updateMenu(menu.id, { theme: patch as MenuTheme })

  return (
    <div className="space-y-5">
      <Section title="Theme" description="A base palette for your customer-facing menu.">
        <div className="grid grid-cols-5 gap-3">
          {(Object.keys(THEME_PRESETS) as ThemePresetId[]).map((id) => {
            const p = THEME_PRESETS[id]
            const active = t.preset === id
            return (
              <button key={id} onClick={() => set({ preset: id, accent: p.accent })} className="group text-center">
                <span
                  className={cn(
                    'relative mx-auto flex aspect-square w-full max-w-16 items-center justify-center overflow-hidden rounded-2xl border-2 transition',
                    active ? 'border-brand-600 ring-4 ring-brand-100' : 'border-transparent shadow-soft group-hover:-translate-y-0.5',
                  )}
                  style={{ background: p.bg }}
                >
                  <span className="absolute inset-x-2 bottom-2 h-1/3 rounded-lg" style={{ background: p.surface, border: `1px solid ${p.border}` }} />
                  <span className="absolute top-2 left-2 size-3 rounded-full" style={{ background: p.accent }} />
                  {active && <Check className="relative size-4" style={{ color: p.text }} strokeWidth={3} />}
                </span>
                <span className={cn('mt-1.5 block text-xs font-medium', active ? 'text-brand-800' : 'text-muted')}>{p.name}</span>
              </button>
            )
          })}
        </div>
      </Section>

      <Section title="Brand Color" description="Used for prices, highlights and category buttons.">
        <div className="flex flex-wrap items-center gap-2.5">
          {ACCENT_SWATCHES.map((c) => (
            <button
              key={c}
              onClick={() => set({ accent: c })}
              className={cn('size-9 rounded-full ring-offset-2 transition', t.accent.toLowerCase() === c.toLowerCase() ? 'ring-2 ring-brand-600' : 'hover:scale-110')}
              style={{ background: c }}
              aria-label={`Use ${c}`}
            />
          ))}
          <label className="ml-1 flex items-center gap-2 rounded-xl border border-line px-2 py-1.5">
            <input type="color" value={t.accent} onChange={(e) => set({ accent: e.target.value })} className="size-7 cursor-pointer rounded-md border-0 bg-transparent p-0" />
            <HexInput value={t.accent} onChange={(accent) => set({ accent })} />
          </label>
        </div>
      </Section>

      <Section title="Typography">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(Object.keys(FONT_PAIRS) as FontPairId[]).map((id) => {
            const f = FONT_PAIRS[id]
            const active = t.font === id
            return (
              <button
                key={id}
                onClick={() => set({ font: id })}
                className={cn('rounded-2xl border p-4 text-left transition', active ? 'border-brand-500 bg-brand-50 ring-4 ring-brand-100' : 'border-line hover:border-brand-200')}
              >
                <span className="block text-3xl leading-none" style={{ fontFamily: f.heading }}>
                  Aa
                </span>
                <span className="mt-2 block text-sm font-semibold">{f.name}</span>
                <span className="block text-[11px] text-muted" style={{ fontFamily: f.body }}>
                  {f.sample}
                </span>
              </button>
            )
          })}
        </div>
      </Section>

      <Section title="Layout">
        <div className="grid grid-cols-3 gap-3">
          {LAYOUTS.map((l) => {
            const active = t.layout === l.id
            return (
              <button
                key={l.id}
                onClick={() => set({ layout: l.id })}
                className={cn('rounded-2xl border p-3 text-left transition', active ? 'border-brand-500 bg-brand-50 ring-4 ring-brand-100' : 'border-line hover:border-brand-200')}
              >
                <LayoutThumb kind={l.id} />
                <span className="mt-2 block text-sm font-semibold">{l.name}</span>
                <span className="hidden text-[11px] text-muted sm:block">{l.description}</span>
              </button>
            )
          })}
        </div>
      </Section>

      <Section title="Cover Image" description="Displayed at the top of your menu.">
        <ImageUpload value={t.cover} onChange={(v) => set({ cover: v })} label="Upload a cover photo" maxSize={1400} />
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs text-muted">Samples:</span>
          {SAMPLE_COVERS.map((c) => (
            <button
              key={c}
              onClick={() => set({ cover: c })}
              className={cn('size-10 overflow-hidden rounded-lg ring-offset-1 transition', t.cover === c ? 'ring-2 ring-brand-600' : 'opacity-80 hover:opacity-100')}
            >
              <img src={c} alt="" className="size-full object-cover" />
            </button>
          ))}
        </div>
      </Section>

      <Section title="Display Options">
        <div className="divide-y divide-line">
          <label className="flex items-center justify-between py-3 first:pt-0">
            <span>
              <span className="block text-sm font-semibold">Show dish photos</span>
              <span className="text-xs text-muted">Hide them for a cleaner, text-only look.</span>
            </span>
            <Switch checked={t.showImages} onChange={(v) => set({ showImages: v })} />
          </label>
          <label className="flex items-center justify-between py-3 last:pb-0">
            <span>
              <span className="block text-sm font-semibold">Category navigation</span>
              <span className="text-xs text-muted">Sticky category pills & dish search.</span>
            </span>
            <Switch checked={t.showCategoryNav} onChange={(v) => set({ showCategoryNav: v })} />
          </label>
        </div>
      </Section>
    </div>
  )
}

function LayoutThumb({ kind }: { kind: MenuTheme['layout'] }) {
  const bar = 'rounded-full bg-brand-200'
  return (
    <div className="flex h-16 flex-col justify-center gap-1.5 rounded-xl bg-white p-2 ring-1 ring-line">
      {kind === 'cards' ? (
        <div className="grid h-full grid-cols-2 gap-1.5">
          {[0, 1].map((i) => (
            <div key={i} className="flex flex-col gap-1 rounded-md bg-brand-50 p-1">
              <div className="h-5 rounded bg-brand-300" />
              <div className={cn(bar, 'h-1 w-3/4')} />
            </div>
          ))}
        </div>
      ) : (
        [0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-1.5">
            {kind === 'list' && <div className="size-3 rounded bg-brand-300" />}
            <div className={cn(bar, 'h-1.5 flex-1')} />
            {kind === 'minimal' && <div className="flex-1 border-b border-dotted border-brand-300" />}
            <div className="h-1.5 w-3 rounded-full bg-brand-500" />
          </div>
        ))
      )}
    </div>
  )
}

function HexInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [text, setText] = useState(value.toUpperCase())
  useEffect(() => setText(value.toUpperCase()), [value])
  return (
    <input
      value={text}
      maxLength={7}
      onChange={(e) => {
        let v = e.target.value.trim()
        if (!v.startsWith('#')) v = '#' + v
        setText(v.toUpperCase())
        if (/^#[0-9a-f]{6}$/i.test(v)) onChange(v)
      }}
      onBlur={() => setText(value.toUpperCase())}
      className="w-20 bg-transparent font-mono text-xs outline-none"
      aria-label="Hex color"
    />
  )
}
