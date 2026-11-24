import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Bell, ChartColumn, ChevronDown, Crown, House, LayoutGrid, LogOut, QrCode, RotateCcw, Settings, BookOpen, ArrowRight } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { cn } from '../../lib/utils'
import { Logo } from '../ui/Brand'
import { UpgradeModal } from '../UpgradeModal'
import { toast } from '../../store/useToast'

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: House },
  { to: '/menus', label: 'My Menus', icon: BookOpen },
  { to: '/analytics', label: 'Analytics', icon: ChartColumn },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function AppLayout() {
  const user = useStore((s) => s.user)!
  const firstMenu = useStore((s) => s.menus[0])
  const logout = useStore((s) => s.logout)
  const resetDemo = useStore((s) => s.resetDemo)
  const navigate = useNavigate()
  const location = useLocation()
  const [upgradeOpen, setUpgradeOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const close = (e: MouseEvent) => menuRef.current && !menuRef.current.contains(e.target as Node) && setMenuOpen(false)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const doLogout = () => {
    logout()
    navigate('/')
  }

  const qrTarget = firstMenu ? `/menus/${firstMenu.id}?tab=qr` : '/menus'
  const isEditor = /^\/menus\/[^/]+/.test(location.pathname)

  return (
    <div className="app-bg min-h-dvh">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[236px] flex-col border-r border-line/70 bg-white/55 backdrop-blur-xl lg:flex">
        <div className="px-6 pt-7 pb-8">
          <Logo to="/dashboard" />
        </div>
        <nav className="flex flex-col gap-1 px-3">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition',
                  isActive ? 'bg-brand-100 text-brand-900 shadow-[inset_0_0_0_1px_rgb(195_181_251/0.6)]' : 'text-ink-soft hover:bg-white hover:text-ink',
                )
              }
            >
              <Icon className="size-[18px]" strokeWidth={1.8} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto px-3 pb-3">
          {user.plan === 'free' ? (
            <div className="rounded-2xl border border-line bg-white/80 p-4 shadow-soft">
              <Crown className="size-5 text-brand-700" strokeWidth={1.8} />
              <p className="mt-3 text-sm font-bold text-brand-900">Upgrade to Pro</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">Unlock advanced customization & analytics.</p>
              <button
                onClick={() => setUpgradeOpen(true)}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-brand-800 px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand-900"
              >
                Upgrade <ArrowRight className="size-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-2xl border border-brand-200 bg-brand-50 p-3 text-xs font-semibold text-brand-800">
              <Crown className="size-4" /> Pro plan active
            </div>
          )}
        </div>

        <div ref={menuRef} className="relative border-t border-line/70 p-3">
          <button onClick={() => setMenuOpen((v) => !v)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-white">
            <span className="flex size-9 items-center justify-center rounded-full bg-brand-300 text-sm font-bold text-white">
              {user.name.charAt(0).toUpperCase()}
            </span>
            <span className="min-w-0 flex-1 text-left">
              <span className="block truncate text-sm font-semibold">{user.name}</span>
              <span className="block truncate text-xs text-muted">{user.email}</span>
            </span>
            <ChevronDown className={cn('size-4 text-muted transition', menuOpen && 'rotate-180')} />
          </button>
          {menuOpen && (
            <div className="animate-pop absolute right-3 bottom-full left-3 mb-2 overflow-hidden rounded-xl border border-line bg-white p-1 shadow-lift">
              <button
                onClick={() => {
                  navigate('/settings')
                  setMenuOpen(false)
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-brand-50"
              >
                <Settings className="size-4" /> Account settings
              </button>
              <button
                onClick={() => {
                  resetDemo()
                  setMenuOpen(false)
                  toast('Demo data restored')
                  navigate('/dashboard')
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-brand-50"
              >
                <RotateCcw className="size-4" /> Reset demo data
              </button>
              <button onClick={doLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                <LogOut className="size-4" /> Log out
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile top bar */}
      {!isEditor && (
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line/60 bg-canvas/80 px-5 py-3.5 backdrop-blur-xl lg:hidden">
          <Logo to="/dashboard" />
          <div className="flex items-center gap-1">
            <button
              className="relative rounded-full p-2 text-ink-soft hover:bg-white"
              aria-label="Notifications"
              onClick={() => toast('You’re all caught up!', 'info')}
            >
              <Bell className="size-5" />
              <span className="absolute top-2 right-2 size-2 rounded-full bg-brand-600 ring-2 ring-canvas" />
            </button>
            <button onClick={doLogout} className="rounded-full p-2 text-ink-soft hover:bg-white" aria-label="Log out">
              <LogOut className="size-5" />
            </button>
          </div>
        </header>
      )}

      <main className="pb-24 lg:pb-0 lg:pl-[236px]">
        <Outlet context={{ openUpgrade: () => setUpgradeOpen(true) }} />
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5">
          {[
            { to: '/dashboard', label: 'Home', icon: House },
            { to: '/menus', label: 'Menus', icon: LayoutGrid },
            { to: qrTarget, label: 'QR Code', icon: QrCode, match: 'tab=qr' },
            { to: '/analytics', label: 'Analytics', icon: ChartColumn },
            { to: '/settings', label: 'Settings', icon: Settings },
          ].map(({ to, label, icon: Icon, match }) => {
            const active = match
              ? location.search.includes(match)
              : location.pathname === to || (to === '/menus' && isEditor && !location.search.includes('tab=qr'))
            return (
              <NavLink
                key={label}
                to={to}
                className={cn('flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition', active ? 'text-brand-800' : 'text-muted')}
              >
                <Icon className="size-5" strokeWidth={active ? 2.2 : 1.8} />
                {label}
              </NavLink>
            )
          })}
        </div>
      </nav>

      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </div>
  )
}
