export type CategoryIcon =
  | 'utensils'
  | 'soup'
  | 'salad'
  | 'beef'
  | 'fish'
  | 'pizza'
  | 'sandwich'
  | 'cloche'
  | 'cake'
  | 'icecream'
  | 'coffee'
  | 'wine'
  | 'drink'
  | 'beer'
  | 'croissant'
  | 'cookie'

export type DishTag = 'vegetarian' | 'vegan' | 'spicy' | 'gluten-free' | 'new' | 'chef'

export interface Dish {
  id: string
  name: string
  description: string
  price: number
  image?: string
  available: boolean
  tags: DishTag[]
}

export interface Category {
  id: string
  name: string
  icon: CategoryIcon
  dishes: Dish[]
}

export type ThemePresetId = 'lavender' | 'cream' | 'noir' | 'sage' | 'emerald'
export type FontPairId = 'classic' | 'elegant' | 'modern' | 'friendly'
export type MenuLayout = 'list' | 'cards' | 'minimal'

export interface MenuTheme {
  preset: ThemePresetId
  accent: string
  font: FontPairId
  layout: MenuLayout
  showImages: boolean
  showCategoryNav: boolean
  cover?: string
}

export type MenuStatus = 'draft' | 'published'

export interface Menu {
  id: string
  name: string
  slug: string
  status: MenuStatus
  createdAt: number
  updatedAt: number
  publishedAt?: number
  views: number
  theme: MenuTheme
  categories: Category[]
}

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'DZD' | 'MAD' | 'TND'

export interface Restaurant {
  name: string
  tagline: string
  cuisine: string
  logo?: string
  phone: string
  email: string
  address: string
  hours: string
  instagram: string
  website: string
  currency: CurrencyCode
}

export interface User {
  name: string
  email: string
  plan: 'free' | 'pro'
}
