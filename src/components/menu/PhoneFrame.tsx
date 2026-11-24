import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

/** Realistic phone mockup used for live previews. */
export function PhoneFrame({ children, className, dark = false }: { children: ReactNode; className?: string; dark?: boolean }) {
  return (
    <div className={cn('relative aspect-[9/19.2] w-[300px] rounded-[48px] bg-[#1b1a1f] p-[10px] shadow-phone', className)}>
      {/* side buttons */}
      <span className="absolute top-[110px] -left-[3px] h-8 w-[3px] rounded-l bg-[#2a2930]" />
      <span className="absolute top-[160px] -left-[3px] h-14 w-[3px] rounded-l bg-[#2a2930]" />
      <span className="absolute top-[140px] -right-[3px] h-20 w-[3px] rounded-r bg-[#2a2930]" />
      <div className="relative h-full w-full overflow-hidden rounded-[39px] bg-white ring-1 ring-black/40">
        {/* status bar */}
        <div
          className={cn(
            'pointer-events-none absolute inset-x-0 top-0 z-20 flex h-11 items-center justify-between px-7 text-[11px] font-semibold',
            dark ? 'text-white' : 'text-white drop-shadow',
          )}
        >
          <span>9:41</span>
          <span className="flex items-center gap-1">
            <svg viewBox="0 0 18 12" className="h-2.5 w-4 fill-current" aria-hidden>
              <rect x="0" y="8" width="3" height="4" rx="1" />
              <rect x="5" y="5" width="3" height="7" rx="1" />
              <rect x="10" y="2.5" width="3" height="9.5" rx="1" />
              <rect x="15" y="0" width="3" height="12" rx="1" />
            </svg>
            <svg viewBox="0 0 26 12" className="h-2.5 w-5" aria-hidden>
              <rect x="0.5" y="0.5" width="22" height="11" rx="3" fill="none" stroke="currentColor" opacity=".5" />
              <rect x="2" y="2" width="17" height="8" rx="2" fill="currentColor" />
              <rect x="23.5" y="4" width="2" height="4" rx="1" fill="currentColor" opacity=".5" />
            </svg>
          </span>
        </div>
        {/* dynamic island */}
        <div className="pointer-events-none absolute top-2.5 left-1/2 z-20 h-[26px] w-[92px] -translate-x-1/2 rounded-full bg-black" />
        <div className="h-full w-full">{children}</div>
        {/* home indicator */}
        <div className="pointer-events-none absolute bottom-1.5 left-1/2 z-20 h-1 w-28 -translate-x-1/2 rounded-full bg-black/70" />
      </div>
    </div>
  )
}
