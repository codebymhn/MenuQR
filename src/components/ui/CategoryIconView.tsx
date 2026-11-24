import {
  Beef,
  Beer,
  CakeSlice,
  ConciergeBell,
  Coffee,
  Cookie,
  Croissant,
  CupSoda,
  Fish,
  IceCreamCone,
  Pizza,
  Salad,
  Sandwich,
  Soup,
  Utensils,
  Wine,
  type LucideIcon,
} from 'lucide-react'
import type { CategoryIcon } from '../../lib/types'

export const CATEGORY_ICONS: Record<CategoryIcon, { icon: LucideIcon; label: string }> = {
  utensils: { icon: Utensils, label: 'Starters' },
  soup: { icon: Soup, label: 'Soups' },
  salad: { icon: Salad, label: 'Salads' },
  beef: { icon: Beef, label: 'Meat' },
  fish: { icon: Fish, label: 'Seafood' },
  pizza: { icon: Pizza, label: 'Pizza' },
  sandwich: { icon: Sandwich, label: 'Sandwiches' },
  cloche: { icon: ConciergeBell, label: 'Main courses' },
  cake: { icon: CakeSlice, label: 'Desserts' },
  icecream: { icon: IceCreamCone, label: 'Ice cream' },
  coffee: { icon: Coffee, label: 'Coffee' },
  wine: { icon: Wine, label: 'Wine' },
  drink: { icon: CupSoda, label: 'Drinks' },
  beer: { icon: Beer, label: 'Beer' },
  croissant: { icon: Croissant, label: 'Bakery' },
  cookie: { icon: Cookie, label: 'Snacks' },
}

export function CategoryIconView({ icon, className }: { icon: CategoryIcon; className?: string }) {
  const Icon = CATEGORY_ICONS[icon]?.icon ?? Utensils
  return <Icon className={className} />
}
