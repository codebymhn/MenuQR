import { Check, Crown } from 'lucide-react'
import { Modal } from './ui/Modal'
import { Button } from './ui/Button'
import { useStore } from '../store/useStore'
import { toast } from '../store/useToast'

export const PRO_FEATURES = [
  'Unlimited menus & dishes',
  'Advanced analytics (scans, top dishes, peak hours)',
  'Custom brand colors & premium fonts',
  'Remove “Powered by MENUQR”',
  'Custom domain for your menu',
  'Priority support',
]

export function UpgradeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const updateUser = useStore((s) => s.updateUser)
  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="pt-4 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-800 text-white shadow-lift">
          <Crown className="size-7" />
        </span>
        <h2 className="mt-4 text-2xl font-bold">MENUQR Pro</h2>
        <p className="mt-1 text-sm text-muted">Everything you need to run a premium digital menu.</p>
        <p className="mt-5">
          <span className="text-4xl font-bold">$12</span>
          <span className="text-sm text-muted"> / month</span>
        </p>
      </div>
      <ul className="mt-6 space-y-2.5">
        {PRO_FEATURES.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-ink-soft">
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
              <Check className="size-3" strokeWidth={3} />
            </span>
            {f}
          </li>
        ))}
      </ul>
      <Button
        className="mt-7 w-full"
        size="lg"
        onClick={() => {
          updateUser({ plan: 'pro' })
          toast('Welcome to Pro! (demo — no payment taken)')
          onClose()
        }}
      >
        Start 14-day free trial
      </Button>
      <p className="mt-3 text-center text-xs text-muted">Demo only — billing isn’t connected in this MVP.</p>
    </Modal>
  )
}
