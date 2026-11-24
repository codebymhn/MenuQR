import { useEffect, useState } from 'react'
import type { CurrencyCode, Restaurant } from '../lib/types'
import { useStore } from '../store/useStore'
import { toast } from '../store/useToast'
import { CURRENCIES } from '../lib/utils'
import { Input, Select } from './ui/Field'
import { ImageUpload } from './ui/ImageUpload'
import { Button } from './ui/Button'
import { LeafMark } from './ui/Brand'

export function RestaurantForm() {
  const restaurant = useStore((s) => s.restaurant)
  const updateRestaurant = useStore((s) => s.updateRestaurant)
  const [form, setForm] = useState<Restaurant>(restaurant)
  const [error, setError] = useState('')

  useEffect(() => setForm(restaurant), [restaurant])

  const set = <K extends keyof Restaurant>(k: K, v: Restaurant[K]) => setForm((f) => ({ ...f, [k]: v }))
  const dirty = JSON.stringify(form) !== JSON.stringify(restaurant)

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return setError('Restaurant name is required')
    updateRestaurant({ ...form, name: form.name.trim() })
    toast('Restaurant info saved')
  }

  return (
    <form onSubmit={save} className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative">
          <ImageUpload value={form.logo} onChange={(v) => set('logo', v)} aspect="logo" maxSize={400} />
          {!form.logo && <LeafMark className="pointer-events-none absolute right-1.5 bottom-1.5 size-6 text-brand-300" />}
        </div>
        <div className="text-sm">
          <p className="font-semibold">Logo</p>
          <p className="text-xs text-muted">Square PNG works best. Without a logo we show an elegant leaf emblem.</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Restaurant name"
          required
          value={form.name}
          error={error}
          onChange={(e) => {
            set('name', e.target.value)
            setError('')
          }}
        />
        <Input label="Tagline" placeholder="Restaurant, Café, Bistro…" value={form.tagline} onChange={(e) => set('tagline', e.target.value)} hint="Shown under the name on your menu" />
        <Input label="Cuisine / description" placeholder="Modern French Restaurant" value={form.cuisine} onChange={(e) => set('cuisine', e.target.value)} />
        <Select label="Currency" value={form.currency} onChange={(e) => set('currency', e.target.value as CurrencyCode)}>
          {(Object.keys(CURRENCIES) as CurrencyCode[]).map((c) => (
            <option key={c} value={c}>
              {c} — {CURRENCIES[c].label} ({CURRENCIES[c].symbol})
            </option>
          ))}
        </Select>
        <Input label="Phone" type="tel" placeholder="+213 555 123 456" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
        <Input label="Email" type="email" placeholder="hello@restaurant.com" value={form.email} onChange={(e) => set('email', e.target.value)} />
        <Input label="Address" placeholder="12 Rue des Oliviers, Alger" value={form.address} onChange={(e) => set('address', e.target.value)} wrapClassName="sm:col-span-2" />
        <Input label="Opening hours" placeholder="Tue – Sun · 12:00 – 23:00" value={form.hours} onChange={(e) => set('hours', e.target.value)} />
        <Input label="Instagram" placeholder="@yourrestaurant" value={form.instagram} onChange={(e) => set('instagram', e.target.value)} />
      </div>
      <div className="flex justify-end gap-2 pt-1">
        {dirty && (
          <Button variant="ghost" onClick={() => setForm(restaurant)}>
            Discard
          </Button>
        )}
        <Button type="submit" disabled={!dirty}>
          Save Changes
        </Button>
      </div>
    </form>
  )
}
