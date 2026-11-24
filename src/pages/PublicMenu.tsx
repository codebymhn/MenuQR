import { useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Lock, ArrowLeft } from 'lucide-react'
import { useStore } from '../store/useStore'
import { MenuView } from '../components/menu/MenuView'
import { Logo, LogoMark } from '../components/ui/Brand'

export default function PublicMenu() {
  const { slug } = useParams()
  const menu = useStore((s) => s.menus.find((m) => m.slug === slug))
  const restaurant = useStore((s) => s.restaurant)
  const user = useStore((s) => s.user)
  const trackView = useStore((s) => s.trackView)
  const tracked = useRef(false)

  useEffect(() => {
    if (menu) document.title = `${restaurant.name} — ${menu.name}`
    if (menu?.status === 'published' && !user && !tracked.current) {
      tracked.current = true
      trackView(menu.slug)
    }
    return () => {
      document.title = 'MENUQR — Elegant digital menus with QR codes'
    }
  }, [menu, restaurant.name, trackView, user])

  if (!menu || (menu.status !== 'published' && !user)) {
    return (
      <div className="app-bg flex min-h-dvh flex-col items-center justify-center px-6 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-white text-brand-700 shadow-soft">
          {menu ? <Lock className="size-6" /> : <LogoMark />}
        </span>
        <h1 className="mt-5 text-2xl font-bold">{menu ? 'This menu isn’t available yet' : 'Menu not found'}</h1>
        <p className="mt-2 max-w-sm text-sm text-muted">
          {menu
            ? 'The restaurant hasn’t published this menu. Please ask a staff member or check back soon.'
            : 'The QR code or link may be outdated. In this MVP, menus are stored in the browser where they were created.'}
        </p>
        <Logo className="mt-10 opacity-70" />
      </div>
    )
  }

  return (
    <>
      {user && (
        <div className="fixed top-3 left-1/2 z-40 flex -translate-x-1/2 items-center whitespace-nowrap gap-2 rounded-full bg-ink/85 py-1.5 pr-4 pl-1.5 text-xs font-medium text-white shadow-lift backdrop-blur">
          <Link to={`/menus/${menu.id}`} className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 hover:bg-white/25">
            <ArrowLeft className="size-3.5" /> Editor
          </Link>
          {menu.status === 'published' ? 'Live menu' : 'Draft · only you can see this'}
        </div>
      )}
      <MenuView menu={menu} restaurant={restaurant} />
    </>
  )
}
