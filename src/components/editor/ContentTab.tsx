import { useState } from 'react'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ChevronDown, EyeOff, GripVertical, ImageOff, Pencil, Plus, Trash2 } from 'lucide-react'
import type { Category, Dish, Menu } from '../../lib/types'
import { useStore } from '../../store/useStore'
import { toast } from '../../store/useToast'
import { cn, formatPrice } from '../../lib/utils'
import { Button, IconButton } from '../ui/Button'
import { ConfirmDialog } from '../ui/Modal'
import { CategoryIconView } from '../ui/CategoryIconView'
import { CategoryModal } from './CategoryModal'
import { DishModal, type DishDraft } from './DishModal'
import { Switch } from '../ui/Field'

function useDndSensors() {
  return useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )
}

type Confirm = { kind: 'category'; cat: Category } | { kind: 'dish'; cat: Category; dish: Dish } | null

export function ContentTab({ menu }: { menu: Menu }) {
  const store = useStore()
  const currency = useStore((s) => s.restaurant.currency)
  const sensors = useDndSensors()
  const [catModal, setCatModal] = useState<{ open: boolean; category?: Category | null }>({ open: false })
  const [dishDraft, setDishDraft] = useState<DishDraft | null>(null)
  const [confirm, setConfirm] = useState<Confirm>(null)
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const onCategoryDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return
    const from = menu.categories.findIndex((c) => c.id === active.id)
    const to = menu.categories.findIndex((c) => c.id === over.id)
    store.moveCategory(menu.id, from, to)
  }

  const dishCount = menu.categories.reduce((n, c) => n + c.dishes.length, 0)

  return (
    <div className="card p-4 sm:p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">Menu Structure</h2>
          <p className="mt-0.5 text-sm text-muted">
            {menu.categories.length} categories · {dishCount} dishes · drag <GripVertical className="inline size-3.5" /> to reorder
          </p>
        </div>
        <Button onClick={() => setCatModal({ open: true, category: null })} icon={<Plus className="size-4" />} className="shrink-0">
          <span className="hidden sm:inline">Add Category</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {menu.categories.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-brand-200 p-10 text-center">
          <p className="font-semibold">Start by adding a category</p>
          <p className="mt-1 text-sm text-muted">Starters, Main Courses, Desserts, Drinks…</p>
          <Button className="mt-4" onClick={() => setCatModal({ open: true, category: null })} icon={<Plus className="size-4" />}>
            Add Category
          </Button>
        </div>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onCategoryDragEnd}>
        <SortableContext items={menu.categories.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {menu.categories.map((cat) => (
              <SortableCategory
                key={cat.id}
                menu={menu}
                cat={cat}
                currency={currency}
                collapsed={!!collapsed[cat.id]}
                onToggleCollapse={() => setCollapsed((s) => ({ ...s, [cat.id]: !s[cat.id] }))}
                onEdit={() => setCatModal({ open: true, category: cat })}
                onDelete={() => setConfirm({ kind: 'category', cat })}
                onAddDish={() => setDishDraft({ categoryId: cat.id })}
                onEditDish={(dish) => setDishDraft({ categoryId: cat.id, dish })}
                onDeleteDish={(dish) => setConfirm({ kind: 'dish', cat, dish })}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <CategoryModal
        open={catModal.open}
        category={catModal.category}
        onClose={() => setCatModal({ open: false })}
        onSave={(data) => {
          if (catModal.category) {
            store.updateCategory(menu.id, catModal.category.id, data)
            toast('Category updated')
          } else {
            store.addCategory(menu.id, data)
            toast('Category added')
          }
          setCatModal({ open: false })
        }}
      />

      <DishModal
        open={!!dishDraft}
        draft={dishDraft}
        categories={menu.categories}
        currency={currency}
        onClose={() => setDishDraft(null)}
        onSave={(categoryId, dish) => {
          store.saveDish(menu.id, categoryId, dish)
          toast(dish.id ? 'Menu updated successfully!' : 'Dish added')
          setDishDraft(null)
        }}
      />

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        title={confirm?.kind === 'category' ? 'Delete category?' : 'Delete dish?'}
        message={
          confirm?.kind === 'category' ? (
            <>
              <b>{confirm.cat.name}</b> and its {confirm.cat.dishes.length} dishes will be removed from this menu.
            </>
          ) : confirm?.kind === 'dish' ? (
            <>
              <b>{confirm.dish.name}</b> will be removed from <b>{confirm.cat.name}</b>.
            </>
          ) : null
        }
        onConfirm={() => {
          if (!confirm) return
          if (confirm.kind === 'category') store.deleteCategory(menu.id, confirm.cat.id)
          else store.deleteDish(menu.id, confirm.cat.id, confirm.dish.id)
          toast(confirm.kind === 'category' ? 'Category deleted' : 'Dish deleted')
        }}
      />
    </div>
  )
}

interface CategoryProps {
  menu: Menu
  cat: Category
  currency: Parameters<typeof formatPrice>[1]
  collapsed: boolean
  onToggleCollapse: () => void
  onEdit: () => void
  onDelete: () => void
  onAddDish: () => void
  onEditDish: (d: Dish) => void
  onDeleteDish: (d: Dish) => void
}

function SortableCategory(props: CategoryProps) {
  const { menu, cat, collapsed, onToggleCollapse, onEdit, onDelete, onAddDish } = props
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id: cat.id })
  const moveDish = useStore((s) => s.moveDish)
  const sensors = useDndSensors()

  const onDishDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return
    const from = cat.dishes.findIndex((d) => d.id === active.id)
    const to = cat.dishes.findIndex((d) => d.id === over.id)
    moveDish(menu.id, cat.id, from, to)
  }

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn('overflow-hidden rounded-2xl border border-line bg-white', isDragging && 'relative z-10 shadow-lift ring-2 ring-brand-300')}
    >
      <div className="flex items-center gap-2 bg-brand-50/50 py-2 pr-2 pl-4">
        <button onClick={onToggleCollapse} className="flex min-w-0 flex-1 items-center gap-3 py-1.5 text-left" aria-expanded={!collapsed}>
          <CategoryIconView icon={cat.icon} className="size-5 shrink-0 text-brand-800" />
          <span className="truncate text-[15px] font-semibold">{cat.name}</span>
          <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-muted">{cat.dishes.length}</span>
          <ChevronDown className={cn('size-4 shrink-0 text-muted transition', collapsed && '-rotate-90')} />
        </button>
        <button
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          className="flex size-9 touch-none items-center justify-center rounded-lg text-muted hover:bg-white hover:text-brand-700"
          aria-label={`Reorder ${cat.name}`}
          style={{ cursor: 'grab' }}
        >
          <GripVertical className="size-4" />
        </button>
        <IconButton label="Edit category" onClick={onEdit}>
          <Pencil className="size-4" />
        </IconButton>
        <IconButton label="Delete category" tone="danger" onClick={onDelete}>
          <Trash2 className="size-4" />
        </IconButton>
      </div>

      {!collapsed && (
        <div className="p-2 pt-0">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDishDragEnd}>
            <SortableContext items={cat.dishes.map((d) => d.id)} strategy={verticalListSortingStrategy}>
              <ul className="divide-y divide-line">
                {cat.dishes.map((d) => (
                  <SortableDish key={d.id} dish={d} {...props} />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
          <button
            onClick={onAddDish}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-brand-200 bg-brand-50/40 py-2.5 text-sm font-semibold text-brand-800 transition hover:border-brand-400 hover:bg-brand-50"
          >
            <Plus className="size-4" /> Add Dish
          </button>
        </div>
      )}
    </div>
  )
}

function SortableDish({ dish, menu, cat, currency, onEditDish, onDeleteDish }: CategoryProps & { dish: Dish }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id: dish.id })
  const toggleDish = useStore((s) => s.toggleDish)

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn('flex items-center gap-2 bg-white py-2.5 sm:gap-3', isDragging && 'relative z-10 rounded-xl shadow-lift ring-2 ring-brand-300')}
    >
      <button
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        className="flex h-9 w-6 shrink-0 touch-none items-center justify-center rounded text-muted/70 hover:text-brand-700"
        aria-label={`Reorder ${dish.name}`}
        style={{ cursor: 'grab' }}
      >
        <GripVertical className="size-4" />
      </button>
      <button onClick={() => onEditDish(dish)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
        <span className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-brand-50 sm:h-12 sm:w-16">
          {dish.image ? (
            <img src={dish.image} alt="" className={cn('size-full object-cover', !dish.available && 'grayscale')} />
          ) : (
            <ImageOff className="absolute inset-0 m-auto size-4 text-brand-300" />
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className={cn('flex items-center gap-2 truncate text-sm font-semibold', !dish.available && 'text-muted')}>
            {dish.name}
            {!dish.available && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
                <EyeOff className="size-3" /> Sold out
              </span>
            )}
          </span>
          <span className="block truncate text-xs text-muted">{dish.description || 'No description'}</span>
        </span>
        <span className="shrink-0 pr-1 text-[15px] font-bold">{formatPrice(dish.price, currency)}</span>
      </button>
      <div className="hidden items-center border-l border-line pl-2 sm:flex">
        <span className="px-1.5" title={dish.available ? 'Available' : 'Sold out'}>
          <Switch size="sm" checked={dish.available} onChange={() => toggleDish(menu.id, cat.id, dish.id)} label="Toggle availability" />
        </span>
        <IconButton label="Edit dish" onClick={() => onEditDish(dish)}>
          <Pencil className="size-4" />
        </IconButton>
        <IconButton label="Delete dish" tone="danger" onClick={() => onDeleteDish(dish)}>
          <Trash2 className="size-4" />
        </IconButton>
      </div>
    </li>
  )
}
