import { useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { Crown, LogOut, RotateCcw } from 'lucide-react'
import { useStore } from '../store/useStore'
import { toast } from '../store/useToast'
import { Section } from '../components/editor/DesignTab'
import { RestaurantForm } from '../components/RestaurantForm'
import { Input } from '../components/ui/Field'
import { Button } from '../components/ui/Button'
import { ConfirmDialog } from '../components/ui/Modal'
import { PRO_FEATURES } from '../components/UpgradeModal'

export default function AccountSettings() {
  const user = useStore((s) => s.user)!
  const updateUser = useStore((s) => s.updateUser)
  const logout = useStore((s) => s.logout)
  const resetDemo = useStore((s) => s.resetDemo)
  const navigate = useNavigate()
  const { openUpgrade } = useOutletContext<{ openUpgrade: () => void }>()
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [confirmReset, setConfirmReset] = useState(false)

  return (
    <div className="mx-auto max-w-3xl px-5 py-6 sm:px-8 lg:py-10">
      <h1 className="text-3xl font-bold">Settings</h1>
      <p className="mt-1 text-sm text-muted">Manage your account, restaurant profile and plan.</p>

      <div className="mt-6 space-y-5">
        <Section title="Profile">
          <form
            className="grid gap-4 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault()
              if (!name.trim() || !email.includes('@')) return toast('Please enter a valid name and email', 'error')
              updateUser({ name: name.trim(), email: email.trim() })
              toast('Profile updated')
            }}
          >
            <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <div className="flex justify-end sm:col-span-2">
              <Button type="submit" disabled={name === user.name && email === user.email}>
                Save Changes
              </Button>
            </div>
          </form>
        </Section>

        <Section title="Restaurant Info" description="Shown on every menu you publish.">
          <RestaurantForm />
        </Section>

        <Section title="Plan">
          <div className="flex flex-col gap-4 rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 p-5 text-white sm:flex-row sm:items-center">
            <Crown className="size-8 shrink-0 text-amber-300" />
            <div className="flex-1">
              <p className="font-bold">{user.plan === 'pro' ? 'MENUQR Pro' : 'Free plan'}</p>
              <p className="text-sm text-white/75">
                {user.plan === 'pro' ? PRO_FEATURES.slice(0, 3).join(' · ') : '1 published menu, basic themes & QR downloads.'}
              </p>
            </div>
            {user.plan === 'pro' ? (
              <Button variant="white" onClick={() => updateUser({ plan: 'free' })}>
                Downgrade
              </Button>
            ) : (
              <Button variant="white" onClick={openUpgrade}>
                Upgrade to Pro
              </Button>
            )}
          </div>
        </Section>

        <Section title="Data & session">
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" icon={<RotateCcw className="size-4" />} onClick={() => setConfirmReset(true)}>
              Reset demo data
            </Button>
            <Button
              variant="secondary"
              icon={<LogOut className="size-4" />}
              onClick={() => {
                logout()
                navigate('/')
              }}
            >
              Log out
            </Button>
          </div>
          <p className="mt-3 text-xs text-muted">In this MVP your data is stored locally in this browser.</p>
        </Section>
      </div>

      <ConfirmDialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        title="Reset demo data?"
        message="All menus and restaurant info will be replaced with the Le Jardin sample data."
        confirmLabel="Reset"
        onConfirm={() => {
          resetDemo()
          toast('Demo data restored')
          navigate('/dashboard')
        }}
      />
    </div>
  )
}
