import type { CSSProperties } from 'react'
import type { FontPairId, MenuLayout, MenuTheme, ThemePresetId } from './types'

export interface ThemePreset {
  id: ThemePresetId
  name: string
  bg: string
  surface: string
  text: string
  muted: string
  border: string
  accent: string
  dark?: boolean
}

export const THEME_PRESETS: Record<ThemePresetId, ThemePreset> = {
  lavender: {
    id: 'lavender',
    name: 'Lavender',
    bg: '#F6F3FF',
    surface: '#FFFFFF',
    text: '#1F1A3A',
    muted: '#6E6888',
    border: '#E7E1FA',
    accent: '#6A4BE0',
  },
  cream: {
    id: 'cream',
    name: 'Cream',
    bg: '#F7F1E6',
    surface: '#FFFCF6',
    text: '#2C2219',
    muted: '#7D6C5A',
    border: '#EADFCB',
    accent: '#A4733F',
  },
  noir: {
    id: 'noir',
    name: 'Noir',
    bg: '#131214',
    surface: '#1D1C20',
    text: '#F4F0E8',
    muted: '#A39D92',
    border: '#2E2C33',
    accent: '#D4AF5A',
    dark: true,
  },
  sage: {
    id: 'sage',
    name: 'Sage',
    bg: '#F0F4EC',
    surface: '#FFFFFF',
    text: '#1F2B1D',
    muted: '#62705D',
    border: '#DCE5D5',
    accent: '#5F8C52',
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald',
    bg: '#ECF4F1',
    surface: '#FFFFFF',
    text: '#0F2A21',
    muted: '#5A7068',
    border: '#D5E6DF',
    accent: '#2E7A62',
  },
}

export const FONT_PAIRS: Record<FontPairId, { name: string; heading: string; body: string; sample: string }> = {
  classic: {
    name: 'Classic',
    heading: '"Cormorant Garamond", Georgia, serif',
    body: '"Plus Jakarta Sans Variable", system-ui, sans-serif',
    sample: 'Cormorant · Plus Jakarta',
  },
  elegant: {
    name: 'Elegant',
    heading: '"Playfair Display", Georgia, serif',
    body: '"Inter Variable", system-ui, sans-serif',
    sample: 'Playfair · Inter',
  },
  modern: {
    name: 'Modern',
    heading: '"Plus Jakarta Sans Variable", system-ui, sans-serif',
    body: '"Plus Jakarta Sans Variable", system-ui, sans-serif',
    sample: 'Plus Jakarta Sans',
  },
  friendly: {
    name: 'Friendly',
    heading: '"Poppins", system-ui, sans-serif',
    body: '"Poppins", system-ui, sans-serif',
    sample: 'Poppins',
  },
}

export const LAYOUTS: { id: MenuLayout; name: string; description: string }[] = [
  { id: 'list', name: 'List', description: 'Photo thumbnails beside each dish' },
  { id: 'cards', name: 'Cards', description: 'Large visual cards in a grid' },
  { id: 'minimal', name: 'Minimal', description: 'Text only, classic bistro style' },
]

export const ACCENT_SWATCHES = ['#6A4BE0', '#7C3AED', '#C2410C', '#A4733F', '#D4AF5A', '#2E7A62', '#5F8C52', '#BE185D', '#1F2937']

/** CSS variables consumed by the customer-facing menu renderer. */
export function themeVars(theme: MenuTheme): CSSProperties {
  const p = THEME_PRESETS[theme.preset] ?? THEME_PRESETS.lavender
  const f = FONT_PAIRS[theme.font] ?? FONT_PAIRS.classic
  return {
    '--m-bg': p.bg,
    '--m-surface': p.surface,
    '--m-text': p.text,
    '--m-muted': p.muted,
    '--m-border': p.border,
    '--m-accent': theme.accent || p.accent,
    '--m-heading': f.heading,
    '--m-body': f.body,
    colorScheme: p.dark ? 'dark' : 'light',
  } as CSSProperties
}
