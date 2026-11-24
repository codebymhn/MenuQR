import { useRef, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { CheckCircle2, Copy, Download, ExternalLink, FileCode2, Printer, Rocket, Crown, ArrowRight } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import type { Menu } from '../../lib/types'
import { useStore } from '../../store/useStore'
import { toast } from '../../store/useToast'
import { cn, copyText, publicMenuUrl } from '../../lib/utils'
import { Button } from '../ui/Button'
import { Switch } from '../ui/Field'
import { downloadPng, downloadSvg, printTableCard, qrLogoDataUrl } from '../menu/qr'
import { Section } from './DesignTab'

const QR_COLORS = ['#1B1735', '#46309E', '#6A4BE0', '#2E7A62', '#A4733F', '#000000']

export function QrTab({ menu }: { menu: Menu }) {
  const restaurant = useStore((s) => s.restaurant)
  const user = useStore((s) => s.user)
  const setStatus = useStore((s) => s.setStatus)
  const ctx = useOutletContext<{ openUpgrade?: () => void } | undefined>()
  const wrapRef = useRef<HTMLDivElement>(null)
  const [color, setColor] = useState('#1B1735')
  const [withLogo, setWithLogo] = useState(true)
  const url = publicMenuUrl(menu.slug)
  const fileBase = `menuqr-${menu.slug}`

  const svg = () => wrapRef.current?.querySelector('svg') as SVGSVGElement | null

  const onPng = async () => {
    const el = svg()
    if (!el) return
    await downloadPng(el, fileBase)
    toast('QR code downloaded')
  }
  const onSvg = () => {
    const el = svg()
    if (!el) return
    downloadSvg(el, fileBase)
    toast('SVG downloaded')
  }
  const onPrint = () => {
    const el = svg()
    if (!el) return
    if (!printTableCard(el, { restaurant: restaurant.name, url, accent: menu.theme.accent })) toast('Please allow pop-ups to print', 'error')
  }

  return (
    <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="card flex flex-col items-center p-6 text-center">
        <div ref={wrapRef} className="rounded-3xl border border-line bg-white p-5 shadow-soft">
          <QRCodeSVG
            value={url}
            size={220}
            level={withLogo ? 'H' : 'M'}
            fgColor={color}
            bgColor="#FFFFFF"
            marginSize={0}
            imageSettings={withLogo ? { src: qrLogoDataUrl(color), height: 46, width: 46, excavate: true } : undefined}
          />
        </div>

        {menu.status === 'published' ? (
          <p className="mt-5 inline-flex items-center gap-2 font-semibold">
            <CheckCircle2 className="size-5 fill-emerald-500 text-white" /> Your menu is live!
          </p>
        ) : (
          <div className="mt-5 rounded-xl bg-amber-50 px-4 py-2.5 text-sm text-amber-800">
            This menu is a <b>draft</b>. Customers will see a “not published” page until you publish.
            <button
              onClick={() => {
                setStatus(menu.id, 'published')
                toast('Menu published 🎉')
              }}
              className="mt-1 flex items-center gap-1 font-semibold text-amber-900 underline-offset-2 hover:underline"
            >
              <Rocket className="size-3.5" /> Publish now
            </button>
          </div>
        )}
        <p className="mt-1 text-sm text-muted">Scan this QR code to view your menu</p>

        <Button size="lg" className="mt-5 w-full max-w-xs" icon={<Download className="size-4" />} onClick={onPng}>
          Download QR
        </Button>

        <div className="my-5 flex w-full max-w-xs items-center gap-3 text-xs text-muted">
          <span className="h-px flex-1 bg-line" /> or share your link <span className="h-px flex-1 bg-line" />
        </div>
        <div className="flex w-full max-w-sm items-center gap-2">
          <a href={`/m/${menu.slug}`} target="_blank" rel="noreferrer" className="input flex min-w-0 items-center gap-2 truncate text-left hover:border-brand-300">
            <ExternalLink className="size-4 shrink-0 text-brand-700" />
            <span className="truncate">{url.replace(/^https?:\/\//, '')}</span>
          </a>
          <Button
            variant="secondary"
            className="shrink-0 px-3"
            aria-label="Copy link"
            onClick={async () => {
              await copyText(url)
              toast('Link copied to clipboard')
            }}
          >
            <Copy className="size-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-5">
        <Section title="Customize QR">
          <span className="field-label">Color</span>
          <div className="flex flex-wrap gap-2.5">
            {QR_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={cn('size-9 rounded-full ring-offset-2 transition', color === c ? 'ring-2 ring-brand-600' : 'hover:scale-110')}
                style={{ background: c }}
                aria-label={`QR color ${c}`}
              />
            ))}
            <button
              onClick={() => setColor(menu.theme.accent)}
              className="rounded-full border border-line px-3 text-xs font-semibold text-ink-soft hover:border-brand-300"
            >
              Use brand color
            </button>
          </div>
          <label className="mt-5 flex items-center justify-between">
            <span>
              <span className="block text-sm font-semibold">MENUQR logo in center</span>
              <span className="text-xs text-muted">Uses high error-correction so it still scans.</span>
            </span>
            <Switch checked={withLogo} onChange={setWithLogo} />
          </label>
        </Section>

        <Section title="Export & Print">
          <div className="grid gap-2">
            <ExportRow icon={Download} title="PNG image" text="High resolution, 1200px — great for print" onClick={onPng} />
            <ExportRow icon={FileCode2} title="SVG vector" text="Infinitely scalable for designers" onClick={onSvg} />
            <ExportRow icon={Printer} title="Table card" text="Print-ready A6 card with your name" onClick={onPrint} />
          </div>
        </Section>

        {user?.plan !== 'pro' && (
          <button
            onClick={() => ctx?.openUpgrade?.()}
            className="card flex w-full items-center gap-4 p-4 text-left transition hover:shadow-lift"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
              <Crown className="size-5" />
            </span>
            <span className="flex-1">
              <span className="block text-sm font-bold">Upgrade to Pro</span>
              <span className="block text-xs text-muted">Get advanced analytics and more customization options.</span>
            </span>
            <ArrowRight className="size-4 text-muted" />
          </button>
        )}
      </div>
    </div>
  )
}

function ExportRow({ icon: Icon, title, text, onClick }: { icon: typeof Download; title: string; text: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-3 rounded-xl border border-line p-3 text-left transition hover:border-brand-300 hover:bg-brand-50/50">
      <span className="flex size-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
        <Icon className="size-4" />
      </span>
      <span className="flex-1">
        <span className="block text-sm font-semibold">{title}</span>
        <span className="block text-xs text-muted">{text}</span>
      </span>
    </button>
  )
}
