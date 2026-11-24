import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Copy, FilePlus2 } from 'lucide-react'
import { Modal } from './ui/Modal'
import { Button } from './ui/Button'
import { Input, Select } from './ui/Field'
import { useStore } from '../store/useStore'
import { toast } from '../store/useToast'
import { cn } from '../lib/utils'

export function CreateMenuModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const menus = useStore((s) => s.menus)
  const createMenu = useStore((s) => s.createMenu)
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [template, setTemplate] = useState<'blank' | 'copy'>('blank')
  const [source, setSource] = useState('')
  const [error, setError] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return setError('Give your menu a name')
    const id = createMenu(name.trim(), template, source || menus[0]?.id)
    toast('Menu created')
    onClose()
    setName('')
    navigate(`/menus/${id}`)
  }

  return (
    <Modal open={open} onClose={onClose} title="Create a new menu" description="E.g. Lunch, Dinner, Drinks, Weekend Brunch…">
      <form onSubmit={submit} className="space-y-5" id="create-menu">
        <Input
          label="Menu name"
          required
          autoFocus
          placeholder="e.g. Dinner Menu"
          value={name}
          error={error}
          onChange={(e) => {
            setName(e.target.value)
            setError('')
          }}
        />
        <div>
          <span className="field-label">Start from</span>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'blank' as const, icon: FilePlus2, title: 'Blank menu', text: 'Start fresh with one category' },
              { id: 'copy' as const, icon: Copy, title: 'Copy existing', text: 'Duplicate dishes & design', disabled: !menus.length },
            ].map((o) => (
              <button
                key={o.id}
                type="button"
                disabled={o.disabled}
                onClick={() => setTemplate(o.id)}
                className={cn(
                  'rounded-2xl border p-4 text-left transition disabled:opacity-40',
                  template === o.id ? 'border-brand-500 bg-brand-50 ring-4 ring-brand-100' : 'border-line hover:border-brand-200',
                )}
              >
                <o.icon className="size-5 text-brand-700" />
                <p className="mt-2 text-sm font-semibold">{o.title}</p>
                <p className="mt-0.5 text-xs text-muted">{o.text}</p>
              </button>
            ))}
          </div>
        </div>
        {template === 'copy' && menus.length > 0 && (
          <Select label="Copy from" value={source || menus[0].id} onChange={(e) => setSource(e.target.value)}>
            {menus.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </Select>
        )}
        <Button type="submit" className="w-full" size="lg">
          Create menu
        </Button>
      </form>
    </Modal>
  )
}
