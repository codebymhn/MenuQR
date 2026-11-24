import { useRef, useState, type ReactNode } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react'
import { useStore } from '../store/useStore'
import { toast } from '../store/useToast'
import { Logo } from '../components/ui/Brand'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Field'
import { PhoneFrame } from '../components/menu/PhoneFrame'
import { MenuView } from '../components/menu/MenuView'
import { createDemoMenus, demoRestaurant } from '../lib/seed'

const demoMenu = createDemoMenus()[0]

function AuthShell({ title, subtitle, children }: { title: string; subtitle: ReactNode; children: ReactNode }) {
  return (
    <div className="app-bg grid min-h-dvh lg:grid-cols-[1fr_1.05fr]">
      <div className="flex flex-col px-6 py-8 sm:px-12">
        <Logo />
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="mt-2 text-sm text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
        <p className="text-center text-xs text-muted">© {new Date().getFullYear()} MENUQR · Made for restaurants</p>
      </div>
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-brand-600 via-brand-800 to-brand-950 lg:flex lg:items-center lg:justify-center">
        <div className="absolute -top-32 -right-32 size-[480px] rounded-full bg-brand-400/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-20 size-[420px] rounded-full bg-fuchsia-400/20 blur-3xl" />
        <div className="relative flex flex-col items-center">
          <PhoneFrame className="w-[290px] rotate-[-4deg]">
            <MenuView menu={demoMenu} restaurant={demoRestaurant} embedded interactive={false} />
          </PhoneFrame>
          <p className="mt-10 max-w-sm text-center text-lg font-medium text-white">
            “We updated our prices in 30 seconds instead of reprinting 60 menus.”
          </p>
          <p className="mt-2 text-sm text-white/60">Mehenna · Owner, Le Jardin</p>
        </div>
      </div>
    </div>
  )
}

function PasswordInput({ value, onChange, error }: { value: string; onChange: (v: string) => void; error?: string }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <Input
        label="Password"
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="••••••••"
        error={error}
        className="pr-10"
        autoComplete="current-password"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute top-[34px] right-3 p-1 text-muted hover:text-ink"
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  )
}

export function Login() {
  const user = useStore((s) => s.user)
  const login = useStore((s) => s.login)
  const loginDemo = useStore((s) => s.loginDemo)
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/dashboard'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  if (user) return <Navigate to={from} replace />

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: typeof errors = {}
    if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = 'Enter a valid email'
    if (password.length < 6) errs.password = 'At least 6 characters'
    setErrors(errs)
    if (Object.keys(errs).length) return
    login(email)
    toast('Welcome back!')
    navigate(from, { replace: true })
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle={
        <>
          New to MENUQR?{' '}
          <Link to="/signup" className="font-semibold text-brand-700 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Input label="Email" type="email" placeholder="you@restaurant.com" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} autoComplete="email" />
        <PasswordInput value={password} onChange={setPassword} error={errors.password} />
        <Button type="submit" size="lg" className="w-full" iconRight={<ArrowRight className="size-4" />}>
          Log in
        </Button>
      </form>
      <div className="my-6 flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-line" /> or <span className="h-px flex-1 bg-line" />
      </div>
      <Button
        variant="secondary"
        size="lg"
        className="w-full"
        icon={<Sparkles className="size-4 text-brand-600" />}
        onClick={() => {
          loginDemo()
          toast('Exploring the Le Jardin demo')
          navigate('/dashboard')
        }}
      >
        Explore the demo account
      </Button>
      <p className="mt-4 text-center text-xs text-muted">Front-end MVP: any email & password (6+ chars) will sign you in.</p>
    </AuthShell>
  )
}

export function Signup() {
  const user = useStore((s) => s.user)
  const signup = useStore((s) => s.signup)
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', restaurant: '', email: '', password: '' })
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({})
  const justSignedUp = useRef(false)

  if (user && !justSignedUp.current) return <Navigate to="/dashboard" replace />

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: typeof errors = {}
    if (!form.name.trim()) errs.name = 'Your name is required'
    if (!form.restaurant.trim()) errs.restaurant = 'Restaurant name is required'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email'
    if (form.password.length < 6) errs.password = 'At least 6 characters'
    setErrors(errs)
    if (Object.keys(errs).length) return
    justSignedUp.current = true
    const menuId = signup(form.name.trim(), form.email.trim(), form.restaurant.trim())
    toast(`Welcome to MENUQR, ${form.name.split(' ')[0]}! Let’s build your menu.`)
    navigate(`/menus/${menuId}`)
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-700 hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Your name" placeholder="Mehenna" value={form.name} onChange={set('name')} error={errors.name} autoComplete="name" />
          <Input label="Restaurant name" placeholder="Le Jardin" value={form.restaurant} onChange={set('restaurant')} error={errors.restaurant} />
        </div>
        <Input label="Email" type="email" placeholder="you@restaurant.com" value={form.email} onChange={set('email')} error={errors.email} autoComplete="email" />
        <PasswordInput value={form.password} onChange={(v) => setForm((f) => ({ ...f, password: v }))} error={errors.password} />
        <Button type="submit" size="lg" className="w-full" iconRight={<ArrowRight className="size-4" />}>
          Create my menu
        </Button>
        <p className="text-center text-xs text-muted">Free forever plan · No credit card required</p>
      </form>
    </AuthShell>
  )
}
