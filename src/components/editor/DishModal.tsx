import { useEffect, useState } from 'react'
import type { Category, Dish, DishTag, Restaurant } from '../../lib/types'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input, Select, Switch, Textarea } from '../ui/Field'
import { ImageUpload } from '../ui/ImageUpload'
import { TAG_META } from '../menu/MenuView'
import { CURRENCIES, cn } from '../../lib/utils'

export interface DishDraft {
  dish?: Dish
  categoryId: string
}

interface Props {
  open: boolean
  draft: DishDraft | null
  categories: Category[]
  currency: Restaurant['currency']
  onClose: () => void
  onSave: (categoryId: string, dish: Omit<Dish, 'id'> & { id?: string }) => void
}

export function DishModal({ open, draft, categories, currency, onClose, onSave }: Props) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState<string | undefined>()
  const [available, setAvailable] = useState(true)
  const [tags, setTags] = useState<DishTag[]>([])
  const [categoryId, setCategoryId] = useState('')
  const [errors, setErrors] = useState<{ name?: string; price?: string }>({})

  useEffect(() => {
    if (!open || !draft) return
    const d = draft.dish
    setName(d?.name ?? '')
    setDescription(d?.description ?? '')
    setPrice(d ? String(d.price) : '')
    setImage(d?.image)
    setAvailable(d?.available ?? true)
    setTags(d?.tags ?? [])
    setCategoryId(draft.categoryId)
    setErrors({})
  }, [open, draft])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const p = parseFloat(price.replace(',', '.'))
    const errs: typeof errors = {}
    if (!name.trim()) errs.name = 'Dish name is required'
    if (Number.isNaN(p) || p < 0) errs.price = 'Enter a valid price'
    setErrors(errs)
    if (Object.keys(errs).length) return
    onSave(categoryId, { id: draft?.dish?.id, name: name.trim(), description: description.trim(), price: p, image, available, tags })
  }

  const toggleTag = (t: DishTag) => setTags((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]))
  const cur = CURRENCIES[currency]

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={draft?.dish ? 'Edit Dish' : 'Add Dish'}
      footer={
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onClose} className="flex-1 sm:flex-none">
            Cancel
          </Button>
          <Button type="submit" form="dish-form" className="flex-1">
            {draft?.dish ? 'Save Changes' : 'Add Dish'}
          </Button>
        </div>
      }
    >
      <form id="dish-form" onSubmit={submit} className="space-y-4">
        <ImageUpload value={image} onChange={setImage} aspect="wide" maxSize={800} />
        <Input
          label="Dish Name"
          required
          placeholder="e.g. Burrata Salad"
          value={name}
          error={errors.name}
          onChange={(e) => setName(e.target.value)}
          autoFocus={!draft?.dish}
        />
        <Textarea label="Description" placeholder="Optional description…" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={160} hint={`${description.length}/160`} />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="field-label">
              Price<span className="ml-0.5 text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sm font-semibold text-muted">{cur.symbol}</span>
              <input
                inputMode="decimal"
                className={cn('input', cur.symbol.length > 1 ? 'pl-10' : 'pl-8', errors.price && 'border-red-300')}
                placeholder="16"
                value={price}
                onChange={(e) => setPrice(e.target.value.replace(/[^0-9.,]/g, ''))}
              />
            </div>
            {errors.price && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.price}</p>}
          </div>
          <Select label="Category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <span className="field-label">Labels</span>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(TAG_META) as DishTag[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => toggleTag(t)}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-xs font-semibold transition',
                  tags.includes(t) ? 'border-brand-600 bg-brand-700 text-white' : 'border-line text-ink-soft hover:border-brand-300',
                )}
              >
                {TAG_META[t].label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-brand-50/60 px-4 py-3">
          <div>
            <p className="text-sm font-semibold">Availability</p>
            <p className="text-xs text-muted">Unavailable dishes are shown as “Sold out”.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-ink-soft">{available ? 'Available' : 'Sold out'}</span>
            <Switch checked={available} onChange={setAvailable} label="Availability" />
          </div>
        </div>
      </form>
    </Modal>
  )
}
