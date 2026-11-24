import { useEffect } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { useStore } from './store/useStore'
import { Toaster } from './components/ui/Toaster'
import AppLayout from './components/layout/AppLayout'
import Landing from './pages/Landing'
import { Login, Signup } from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Menus from './pages/Menus'
import MenuEditor from './pages/MenuEditor'
import Analytics from './pages/Analytics'
import AccountSettings from './pages/AccountSettings'
import PublicMenu from './pages/PublicMenu'
import NotFound from './pages/NotFound'

function RequireAuth() {
  const user = useStore((s) => s.user)
  const location = useLocation()
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <Outlet />
}

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/m/:slug" element={<PublicMenu />} />
        <Route element={<RequireAuth />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/menus" element={<Menus />} />
            <Route path="/menus/:id" element={<MenuEditor />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<AccountSettings />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  )
}
