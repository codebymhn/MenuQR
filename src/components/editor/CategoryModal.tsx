import { useEffect, useState } from 'react'
import type { Category, CategoryIcon } from '../../lib/types'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Field'
import { CATEGORY_ICONS, CategoryIconView } from '../ui/CategoryIconView'
import { cn } from '../../lib/utils'

const SUGGESTIONS = ['Starters', 'Main Courses', 'Desserts', 'Drinks', 'Salads', 'Pizza', 'Coffee', 'Wine List']

export function CategoryModal({
  open,
  category,
  onClose,
  onSave,
}: {
  open: boolean
  category?: Category | null
  onClose: () => void
  onSave: (data: { name: string; icon: CategoryIcon }) => void
}) {
  const [name, setName] = useState('')
  const [icon, setIcon] = useState<CategoryIcon>('utensils')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    setName(category?.name ?? '')
    setIcon(category?.icon ?? 'utensils')
    setError('')
  }, [open, category])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return setError('Category name is required')
    onSave({ name: name.trim(), icon })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={category ? 'Edit Category' : 'Add Category'}
      size="sm"
      footer={
        <Button type="submit" form="cat-form" className="w-full">
          {category ? 'Save Changes' : 'Add Category'}
        </Button>
      }
    >
      <form id="cat-form" onSubmit={submit} className="space-y-5">
        <Input
          label="Category name"
          required
          autoFocus
          placeholder="e.g. Starters"
          value={name}
          error={error}
          onChange={(e) => {
            setName(e.target.value)
            setError('')
          }}
        />
        {!category && (
          <div className="-mt-2 flex flex-wrap gap-1.5">
            {SUGGESTIONS.map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => setName(s)}
                className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-800 hover:bg-brand-100"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <div>
          <span className="field-label">Icon</span>
          <div className="grid grid-cols-8 gap-1.5">
            {(Object.keys(CATEGORY_ICONS) as CategoryIcon[]).map((k) => (
              <button
                key={k}
                type="button"
                title={CATEGORY_ICONS[k].label}
                onClick={() => setIcon(k)}
                className={cn(
                  'flex aspect-square items-center justify-center rounded-xl border transition',
                  icon === k ? 'border-brand-600 bg-brand-700 text-white' : 'border-line text-ink-soft hover:border-brand-300 hover:text-brand-700',
                )}
              >
                <CategoryIconView icon={k} className="size-[18px]" />
              </button>
            ))}
          </div>
        </div>
      </form>
    </Modal>
  )
}
