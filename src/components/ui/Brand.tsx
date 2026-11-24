import { Link } from 'react-router-dom'
import type { SVGProps } from 'react'
import { cn } from '../../lib/utils'

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={cn('size-8', className)} aria-hidden>
      <path
        d="M4 11V7.5A3.5 3.5 0 0 1 7.5 4H11M21 4h3.5A3.5 3.5 0 0 1 28 7.5V11M28 21v3.5a3.5 3.5 0 0 1-3.5 3.5H21M11 28H7.5A3.5 3.5 0 0 1 4 24.5V21"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <rect x="10" y="10" width="5" height="5" rx="1.2" fill="currentColor" />
      <rect x="17" y="10" width="5" height="5" rx="1.2" fill="currentColor" />
      <rect x="10" y="17" width="5" height="5" rx="1.2" fill="currentColor" />
      <rect x="17" y="17" width="5" height="5" rx="1.2" fill="currentColor" opacity=".45" />
    </svg>
  )
}

export function Logo({ to = '/', className, light }: { to?: string; className?: string; light?: boolean }) {
  return (
    <Link to={to} className={cn('inline-flex items-center gap-2.5', className)} aria-label="MENUQR home">
      <LogoMark className={light ? 'text-white' : 'text-brand-800'} />
      <span className={cn('text-[17px] font-bold tracking-wide', light ? 'text-white' : 'text-ink')}>MENUQR</span>
    </Link>
  )
}

/** Elegant leaf emblem used as the default restaurant logo (as in the "Le Jardin" mockups). */
export function LeafMark({ className, ...rest }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden {...rest}>
      <path d="M24 44V20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M24 22c0-8 4-14 4-14s4 6 0 13c-1.6 2.6-4 1-4 1Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M24 22c0-8-4-14-4-14s-4 6 0 13c1.6 2.6 4 1 4 1Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M24 32c-2-6-9-8-12-8 0 0 1 8 7 10 3 1 5-2 5-2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M24 32c2-6 9-8 12-8 0 0-1 8-7 10-3 1-5-2-5-2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

/** Decorative botanical branch for the marketing pages. */
export function Foliage({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 260" className={className} aria-hidden>
      <defs>
        <linearGradient id="leafg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#4f7a3a" />
          <stop offset="1" stopColor="#24451c" />
        </linearGradient>
      </defs>
      <path d="M40 255 C70 190 95 120 160 20" stroke="#3a5a2c" strokeWidth="3" fill="none" />
      {[
        [62, 200, -40],
        [80, 160, 30],
        [96, 130, -50],
        [112, 100, 20],
        [126, 76, -45],
        [142, 50, 25],
        [70, 180, 150],
      ].map(([x, y, r], i) => (
        <path
          key={i}
          d="M0 0 C 18 -22, 58 -22, 74 0 C 58 18, 18 18, 0 0 Z"
          transform={`translate(${x} ${y}) rotate(${r}) scale(${0.75 + (i % 3) * 0.12})`}
          fill="url(#leafg)"
          opacity={0.9 - (i % 2) * 0.15}
        />
      ))}
    </svg>
  )
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}
export function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.77L17.75 3Zm-1.08 16.2h1.7L7.4 4.7H5.58l11.09 14.5Z" />
    </svg>
  )
}
export function YoutubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.3 5 12 5 12 5s-6.3 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.76 1.77C5.7 19 12 19 12 19s6.3 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z" />
    </svg>
  )
}
