import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import type { Menu } from '../../lib/types'
import { useStore } from '../../store/useStore'
import { toast } from '../../store/useToast'
import { slugify } from '../../lib/utils'
import { Input } from '../ui/Field'
import { Button } from '../ui/Button'
import { ConfirmDialog } from '../ui/Modal'
import { RestaurantForm } from '../RestaurantForm'
import { Section } from './DesignTab'

export function SettingsTab({ menu }: { menu: Menu }) {
  const updateMenu = useStore((s) => s.updateMenu)
  const isSlugTaken = useStore((s) => s.isSlugTaken)
  const deleteMenu = useStore((s) => s.deleteMenu)
  const navigate = useNavigate()
  const [name, setName] = useState(menu.name)
  const [slug, setSlug] = useState(menu.slug)
  const [errors, setErrors] = useState<{ name?: string; slug?: string }>({})
  const [confirm, setConfirm] = useState(false)

  useEffect(() => {
    setName(menu.name)
    setSlug(menu.slug)
  }, [menu.name, menu.slug])

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    const clean = slugify(slug)
    const errs: typeof errors = {}
    if (!name.trim()) errs.name = 'Menu name is required'
    if (!clean) errs.slug = 'Use letters, numbers and dashes'
    else if (isSlugTaken(clean, menu.id)) errs.slug = 'This link is already used by another menu'
    setErrors(errs)
    if (Object.keys(errs).length) return
    updateMenu(menu.id, { name: name.trim(), slug: clean })
    setSlug(clean)
    toast('Menu settings saved')
  }

  const dirty = name !== menu.name || slug !== menu.slug

  return (
    <div className="space-y-5">
      <Section title="Menu Details">
        <form onSubmit={save} className="space-y-4">
          <Input label="Menu name" required value={name} error={errors.name} onChange={(e) => setName(e.target.value)} />
          <div>
            <label className="field-label">Public link</label>
            <div className="flex overflow-hidden rounded-xl border border-line focus-within:border-brand-400 focus-within:ring-4 focus-within:ring-brand-100">
              <span className="flex items-center border-r border-line bg-brand-50/60 px-3 text-sm whitespace-nowrap text-muted">
                {window.location.host}/m/
              </span>
              <input className="min-w-0 flex-1 px-3 py-2.5 text-sm outline-none" value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s/g, '-'))} />
            </div>
            {errors.slug ? (
              <p className="mt-1.5 text-xs font-medium text-red-600">{errors.slug}</p>
            ) : (
              <p className="mt-1.5 text-xs text-muted">Changing the link will break QR codes you already printed.</p>
            )}
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={!dirty}>
              Save Changes
            </Button>
          </div>
        </form>
      </Section>

      <Section title="Restaurant Info" description="Shared by all your menus — shown in the header and footer.">
        <RestaurantForm />
      </Section>

      <section className="rounded-2xl border border-red-200 bg-red-50/50 p-5">
        <h3 className="font-bold text-red-700">Danger zone</h3>
        <p className="mt-0.5 text-sm text-red-700/80">Deleting this menu is permanent and its QR code will stop working.</p>
        <Button variant="danger" className="mt-4" icon={<Trash2 className="size-4" />} onClick={() => setConfirm(true)}>
          Delete menu
        </Button>
      </section>

      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        title="Delete this menu?"
        message={
          <>
            <b>{menu.name}</b> and all its dishes will be permanently removed.
          </>
        }
        onConfirm={() => {
          deleteMenu(menu.id)
          toast('Menu deleted')
          navigate('/menus')
        }}
      />
    </div>
  )
}
