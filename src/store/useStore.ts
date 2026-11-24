import { create } from 'zustand'
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware'
import type { Category, Dish, Menu, MenuStatus, Restaurant, User } from '../lib/types'
import { createDemoMenus, createStarterMenu, DEFAULT_THEME, demoRestaurant, demoUser } from '../lib/seed'
import { slugify, uid } from '../lib/utils'
import { toast } from './useToast'

interface AppState {
  user: User | null
  restaurant: Restaurant
  menus: Menu[]

  // auth
  loginDemo: () => void
  login: (email: string) => void
  signup: (name: string, email: string, restaurantName: string) => string
  logout: () => void
  updateUser: (patch: Partial<User>) => void
  resetDemo: () => void

  // restaurant
  updateRestaurant: (patch: Partial<Restaurant>) => void

  // menus
  createMenu: (name: string, template: 'blank' | 'copy', copyFromId?: string) => string
  duplicateMenu: (id: string) => string | undefined
  deleteMenu: (id: string) => void
  updateMenu: (id: string, patch: Partial<Omit<Menu, 'id' | 'categories'>>) => void
  setStatus: (id: string, status: MenuStatus) => void
  isSlugTaken: (slug: string, exceptId?: string) => boolean
  trackView: (slug: string) => void

  // categories
  addCategory: (menuId: string, data: Pick<Category, 'name' | 'icon'>) => string
  updateCategory: (menuId: string, catId: string, data: Partial<Pick<Category, 'name' | 'icon'>>) => void
  deleteCategory: (menuId: string, catId: string) => void
  moveCategory: (menuId: string, from: number, to: number) => void

  // dishes
  saveDish: (menuId: string, catId: string, dish: Omit<Dish, 'id'> & { id?: string }) => void
  deleteDish: (menuId: string, catId: string, dishId: string) => void
  moveDish: (menuId: string, catId: string, from: number, to: number) => void
  toggleDish: (menuId: string, catId: string, dishId: string) => void
}

const arrayMove = <T,>(arr: T[], from: number, to: number) => {
  const copy = arr.slice()
  const [item] = copy.splice(from, 1)
  copy.splice(to, 0, item)
  return copy
}

/** localStorage wrapper that never crashes the app when quota is exceeded. */
let quotaWarned = false
const safeStorage: StateStorage = {
  getItem: (name) => localStorage.getItem(name),
  removeItem: (name) => localStorage.removeItem(name),
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, value)
      quotaWarned = false
    } catch {
      if (!quotaWarned) {
        quotaWarned = true
        toast('Browser storage is full — try using smaller images.', 'error')
      }
    }
  },
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => {
      /** Apply an updater to one menu and bump its updatedAt. */
      const patchMenu = (menuId: string, fn: (m: Menu) => Menu) =>
        set((s) => ({ menus: s.menus.map((m) => (m.id === menuId ? { ...fn(m), updatedAt: Date.now() } : m)) }))
      const patchCategory = (menuId: string, catId: string, fn: (c: Category) => Category) =>
        patchMenu(menuId, (m) => ({ ...m, categories: m.categories.map((c) => (c.id === catId ? fn(c) : c)) }))

      const uniqueSlug = (base: string, exceptId?: string) => {
        const root = slugify(base) || 'menu'
        let slug = root
        let i = 2
        while (get().isSlugTaken(slug, exceptId)) slug = `${root}-${i++}`
        return slug
      }

      return {
        user: null,
        restaurant: demoRestaurant,
        menus: createDemoMenus(),

        loginDemo: () => set({ user: demoUser }),
        login: (email) => {
          const current = get().user
          set({ user: { ...(current ?? demoUser), email } })
        },
        signup: (name, email, restaurantName) => {
          const slug = slugify(restaurantName) || 'my-restaurant'
          const menu = createStarterMenu(slug)
          set({
            user: { name, email, plan: 'free' },
            restaurant: {
              name: restaurantName,
              tagline: 'Restaurant',
              cuisine: '',
              phone: '',
              email,
              address: '',
              hours: '',
              instagram: '',
              website: '',
              currency: 'USD',
            },
            menus: [menu],
          })
          return menu.id
        },
        logout: () => set({ user: null }),
        updateUser: (patch) => set((s) => ({ user: s.user ? { ...s.user, ...patch } : s.user })),
        resetDemo: () => set({ restaurant: demoRestaurant, menus: createDemoMenus(), user: get().user ? demoUser : null }),

        updateRestaurant: (patch) => set((s) => ({ restaurant: { ...s.restaurant, ...patch } })),

        createMenu: (name, template, copyFromId) => {
          const now = Date.now()
          const source = template === 'copy' ? get().menus.find((m) => m.id === copyFromId) : undefined
          const menu: Menu = {
            id: uid('m_'),
            name,
            slug: uniqueSlug(`${get().restaurant.name}-${name}`),
            status: 'draft',
            createdAt: now,
            updatedAt: now,
            views: 0,
            theme: source ? { ...source.theme } : { ...DEFAULT_THEME },
            categories: source
              ? source.categories.map((c) => ({ ...c, id: uid('c_'), dishes: c.dishes.map((d) => ({ ...d, id: uid('d_') })) }))
              : [{ id: uid('c_'), name: 'Starters', icon: 'utensils', dishes: [] }],
          }
          set((s) => ({ menus: [...s.menus, menu] }))
          return menu.id
        },
        duplicateMenu: (id) => {
          const src = get().menus.find((m) => m.id === id)
          if (!src) return
          return get().createMenu(`${src.name} (copy)`, 'copy', id)
        },
        deleteMenu: (id) => set((s) => ({ menus: s.menus.filter((m) => m.id !== id) })),
        updateMenu: (id, patch) => patchMenu(id, (m) => ({ ...m, ...patch, theme: patch.theme ? { ...m.theme, ...patch.theme } : m.theme })),
        setStatus: (id, status) =>
          patchMenu(id, (m) => ({ ...m, status, publishedAt: status === 'published' ? Date.now() : m.publishedAt })),
        isSlugTaken: (slug, exceptId) => get().menus.some((m) => m.slug === slug && m.id !== exceptId),
        trackView: (slug) =>
          set((s) => ({ menus: s.menus.map((m) => (m.slug === slug ? { ...m, views: m.views + 1 } : m)) })),

        addCategory: (menuId, data) => {
          const id = uid('c_')
          patchMenu(menuId, (m) => ({ ...m, categories: [...m.categories, { id, ...data, dishes: [] }] }))
          return id
        },
        updateCategory: (menuId, catId, data) => patchCategory(menuId, catId, (c) => ({ ...c, ...data })),
        deleteCategory: (menuId, catId) =>
          patchMenu(menuId, (m) => ({ ...m, categories: m.categories.filter((c) => c.id !== catId) })),
        moveCategory: (menuId, from, to) =>
          patchMenu(menuId, (m) => ({ ...m, categories: arrayMove(m.categories, from, to) })),

        saveDish: (menuId, catId, dish) =>
          patchMenu(menuId, (m) => {
            // remove from any category it currently lives in (supports moving between categories)
            let existingIndex = -1
            let existingCat: string | undefined
            const stripped = m.categories.map((c) => {
              const idx = dish.id ? c.dishes.findIndex((d) => d.id === dish.id) : -1
              if (idx === -1) return c
              existingIndex = idx
              existingCat = c.id
              return { ...c, dishes: c.dishes.filter((d) => d.id !== dish.id) }
            })
            const full: Dish = { ...dish, id: dish.id ?? uid('d_') }
            return {
              ...m,
              categories: stripped.map((c) => {
                if (c.id !== catId) return c
                const dishes = c.dishes.slice()
                if (existingCat === catId && existingIndex >= 0) dishes.splice(existingIndex, 0, full)
                else dishes.push(full)
                return { ...c, dishes }
              }),
            }
          }),
        deleteDish: (menuId, catId, dishId) =>
          patchCategory(menuId, catId, (c) => ({ ...c, dishes: c.dishes.filter((d) => d.id !== dishId) })),
        moveDish: (menuId, catId, from, to) =>
          patchCategory(menuId, catId, (c) => ({ ...c, dishes: arrayMove(c.dishes, from, to) })),
        toggleDish: (menuId, catId, dishId) =>
          patchCategory(menuId, catId, (c) => ({
            ...c,
            dishes: c.dishes.map((d) => (d.id === dishId ? { ...d, available: !d.available } : d)),
          })),
      }
    },
    {
      name: 'menuqr-store-v1',
      storage: createJSONStorage(() => safeStorage),
      partialize: (s) => ({ user: s.user, restaurant: s.restaurant, menus: s.menus }),
    },
  ),
)

export const useMenu = (id?: string) => useStore((s) => s.menus.find((m) => m.id === id))
