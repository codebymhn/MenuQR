import type { Menu } from './types'
import { seeded } from './utils'

/** Demo analytics generated deterministically from the menu id (no backend in the MVP). */
export function dailySeries(menu: Menu, days: number) {
  const rand = seeded(menu.id)
  const base = menu.status === 'published' ? Math.max(40, menu.views / 120) : 0
  const out: { date: Date; views: number; scans: number }[] = []
  const today = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const weekend = d.getDay() === 5 || d.getDay() === 6 || d.getDay() === 0 ? 1.45 : 1
    const trend = 1 + (days - i) / (days * 3)
    const views = Math.round(base * weekend * trend * (0.75 + rand() * 0.5))
    out.push({ date: d, views, scans: Math.round(views * (0.62 + rand() * 0.15)) })
  }
  return out
}

export function hourlyDistribution(menu: Menu) {
  const rand = seeded(menu.id + 'h')
  // lunch & dinner peaks
  return Array.from({ length: 15 }, (_, i) => {
    const h = i + 9
    const lunch = Math.exp(-((h - 13) ** 2) / 2.5)
    const dinner = Math.exp(-((h - 20.5) ** 2) / 3) * 1.3
    return { hour: h, value: Math.round((lunch + dinner + 0.08) * 100 * (0.85 + rand() * 0.3)) }
  })
}

export function topDishes(menu: Menu, n = 5) {
  const rand = seeded(menu.id + 'd')
  return menu.categories
    .flatMap((c) => c.dishes.map((d) => ({ dish: d, category: c.name, views: Math.round(200 + rand() * 1600) })))
    .sort((a, b) => b.views - a.views)
    .slice(0, n)
}

export function deviceSplit(menu: Menu) {
  const rand = seeded(menu.id + 'x')
  const ios = 48 + Math.round(rand() * 8)
  const android = 38 + Math.round(rand() * 6)
  return [
    { label: 'iOS', value: ios },
    { label: 'Android', value: android },
    { label: 'Desktop', value: 100 - ios - android },
  ]
}

export const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0)

export function pctChange(series: number[]) {
  const half = Math.floor(series.length / 2)
  const a = sum(series.slice(0, half))
  const b = sum(series.slice(half))
  if (!a) return 0
  return Math.round(((b - a) / a) * 100)
}
