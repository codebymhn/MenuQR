import { ButtonLink } from '../components/ui/Button'
import { Logo } from '../components/ui/Brand'

export default function NotFound() {
  return (
    <div className="app-bg flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <Logo />
      <p className="mt-10 text-7xl font-bold text-brand-200">404</p>
      <h1 className="mt-2 text-2xl font-bold">This page isn’t on the menu</h1>
      <p className="mt-2 text-sm text-muted">The page you’re looking for doesn’t exist or has moved.</p>
      <ButtonLink to="/" className="mt-8">
        Back to home
      </ButtonLink>
    </div>
  )
}
