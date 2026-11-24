import type { CurrencyCode } from './types'

export { clsx as cn } from 'clsx'

export const uid = (prefix = '') =>
  prefix + Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4)

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)

export const CURRENCIES: Record<CurrencyCode, { label: string; symbol: string; suffix?: boolean; decimals: number }> = {
  USD: { label: 'US Dollar', symbol: '$', decimals: 2 },
  EUR: { label: 'Euro', symbol: '€', decimals: 2 },
  GBP: { label: 'British Pound', symbol: '£', decimals: 2 },
  DZD: { label: 'Algerian Dinar', symbol: 'DA', suffix: true, decimals: 0 },
  MAD: { label: 'Moroccan Dirham', symbol: 'DH', suffix: true, decimals: 2 },
  TND: { label: 'Tunisian Dinar', symbol: 'DT', suffix: true, decimals: 2 },
}

export function formatPrice(price: number, currency: CurrencyCode = 'USD') {
  const c = CURRENCIES[currency] ?? CURRENCIES.USD
  const isWhole = Number.isInteger(price)
  const num = price.toLocaleString('en-US', {
    minimumFractionDigits: isWhole ? 0 : c.decimals,
    maximumFractionDigits: c.decimals,
  })
  return c.suffix ? `${num} ${c.symbol}` : `${c.symbol}${num}`
}

export function timeAgo(ts: number, now = Date.now()) {
  const s = Math.max(0, Math.round((now - ts) / 1000))
  if (s < 10) return 'just now'
  if (s < 60) return `${s} sec ago`
  const m = Math.round(s / 60)
  if (m < 60) return `${m} min ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h} h ago`
  const d = Math.round(h / 24)
  if (d < 30) return `${d} day${d > 1 ? 's' : ''} ago`
  return new Date(ts).toLocaleDateString()
}

export const compactNumber = (n: number) =>
  Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(n)

/** Read an image file, downscale it and return a compressed data URL (keeps localStorage small). */
export function fileToDataUrl(file: File, maxSize = 900, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) return reject(new Error('Please choose an image file (JPG, PNG, WebP).'))
    if (file.size > 8 * 1024 * 1024) return reject(new Error('Image is too large (max 8 MB).'))
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read file.'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Unsupported image.'))
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        const isPng = file.type === 'image/png' || file.type === 'image/svg+xml'
        resolve(canvas.toDataURL(isPng ? 'image/png' : 'image/jpeg', quality))
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })
}

/** Deterministic pseudo random generator (for stable demo analytics). */
export function seeded(seedStr: string) {
  let h = 1779033703 ^ seedStr.length
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return ((h ^= h >>> 16) >>> 0) / 4294967296
  }
}

export const publicMenuUrl = (slug: string) => `${window.location.origin}/m/${slug}`

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const ta = document.createElement('textarea')
    ta.value = text
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    ta.remove()
    return ok
  }
}
