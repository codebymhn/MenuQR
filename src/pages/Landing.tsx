import { useState } from 'react'
import { Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  Crown,
  Menu as MenuIcon,
  Palette,
  Play,
  Printer,
  QrCode,
  RefreshCw,
  Smartphone,
  Wallet,
  X,
  Zap,
  Globe,
  ImageIcon,
} from 'lucide-react'
import { ButtonLink } from '../components/ui/Button'
import { Foliage, InstagramIcon, LeafMark, Logo, XIcon, YoutubeIcon } from '../components/ui/Brand'
import { PhoneFrame } from '../components/menu/PhoneFrame'
import { MenuView } from '../components/menu/MenuView'
import { createDemoMenus, demoRestaurant } from '../lib/seed'
import { useStore } from '../store/useStore'
import { cn, publicMenuUrl } from '../lib/utils'

const heroMenu = createDemoMenus()[0]

const NAV_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#how', label: 'How it works' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
]

export default function Landing() {
  const user = useStore((s) => s.user)
  const demoSlug = useStore((s) => s.menus.find((m) => m.status === 'published')?.slug ?? 'le-jardin')
  const [mobileNav, setMobileNav] = useState(false)
  const cta = user ? '/dashboard' : '/signup'

  return (
    <div className="overflow-x-hidden bg-[#F4F1FD] text-ink">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-transparent bg-[#F4F1FD]/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Logo />
          <nav className="hidden items-center gap-10 md:flex">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="text-sm font-medium text-ink-soft transition hover:text-ink">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            {!user && (
              <Link to="/login" className="rounded-full px-4 py-2 text-sm font-semibold text-ink-soft hover:text-ink">
                Log in
              </Link>
            )}
            <ButtonLink to={cta} variant="dark" size="sm" className="rounded-full px-5" iconRight={<ArrowRight className="size-4" />}>
              {user ? 'Dashboard' : 'Get Started'}
            </ButtonLink>
          </div>
          <button className="rounded-lg p-2 md:hidden" onClick={() => setMobileNav((v) => !v)} aria-label="Toggle navigation">
            {mobileNav ? <X className="size-6" /> : <MenuIcon className="size-6" />}
          </button>
        </div>
        {mobileNav && (
          <div className="animate-fade-in border-t border-line bg-white px-5 py-4 md:hidden">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setMobileNav(false)} className="block py-2.5 font-medium text-ink-soft">
                {l.label}
              </a>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <ButtonLink to="/login" variant="secondary">
                Log in
              </ButtonLink>
              <ButtonLink to={cta} variant="dark">
                Get Started
              </ButtonLink>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="pointer-events-none absolute -top-24 right-0 h-[860px] w-full bg-[radial-gradient(55%_60%_at_78%_38%,rgb(195_181_251/0.55),rgb(221_213_253/0.25)_55%,transparent_75%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pt-10 pb-16 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:pt-16 lg:pb-24">
          <div className="animate-slide-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/70 px-3 py-1 text-xs font-semibold text-brand-800">
              <span className="size-1.5 rounded-full bg-emerald-500" /> No app download for your guests
            </span>
            <h1 className="mt-6 text-[44px] leading-[1.05] font-light tracking-tight sm:text-6xl lg:text-[68px]">
              Make your elegant and immersive <span className="font-bold text-brand-800">menu.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">
              Create beautiful digital menus, generate QR codes and delight your customers.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <ButtonLink to={cta} variant="dark" size="lg" className="rounded-full" iconRight={<ArrowRight className="size-4" />}>
                Get Started
              </ButtonLink>
              <Link to={`/m/${demoSlug}`} className="group inline-flex items-center gap-3 rounded-full py-2 pr-3 text-[15px] font-semibold">
                <span className="flex size-10 items-center justify-center rounded-full border-2 border-ink/80 transition group-hover:bg-ink group-hover:text-white">
                  <Play className="ml-0.5 size-4 fill-current" />
                </span>
                See Live Demo
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {['#C4B5FD', '#F9A8D4', '#FCD34D', '#86EFAC'].map((c, i) => (
                  <span
                    key={c}
                    className="flex size-9 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-ink/70"
                    style={{ background: c }}
                  >
                    {['S', 'A', 'K', 'R'][i]}
                  </span>
                ))}
              </div>
              <p className="text-sm text-ink-soft">Trusted by 5,000+ restaurants</p>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative mx-auto h-[600px] w-full max-w-[520px]">
            <div className="absolute inset-x-6 top-10 bottom-10 rounded-[48%] bg-gradient-to-br from-brand-300/60 to-brand-100/30 blur-2xl" />
            <Foliage className="absolute -top-6 -right-10 w-44 rotate-[200deg] opacity-90" />
            <Foliage className="absolute bottom-10 -left-12 w-40 rotate-[-30deg] opacity-80" />
            <div className="animate-float absolute top-2 left-1/2 -translate-x-[62%] sm:-translate-x-[65%]">
              <PhoneFrame className="w-[270px] rotate-[8deg] sm:w-[285px]">
                <MenuView menu={heroMenu} restaurant={demoRestaurant} embedded />
              </PhoneFrame>
            </div>
            <div
              className="absolute right-0 bottom-16 w-[170px] rotate-[6deg] rounded-3xl bg-white p-4 text-center shadow-lift sm:right-2 sm:w-[190px]"
              style={{ animation: 'float 7s ease-in-out infinite 1s' }}
            >
              <QRCodeSVG value={publicMenuUrl(demoSlug)} size={150} fgColor="#1b1735" marginSize={0} className="h-auto w-full" />
              <p className="mt-3 font-serif text-2xl italic">Scan. Enjoy.</p>
              <span className="mx-auto mt-1 block h-0.5 w-16 rounded-full bg-brand-400" />
            </div>
          </div>
        </div>
      </section>

      {/* Loved by */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="mb-6 text-center text-xs font-semibold tracking-[0.2em] text-muted uppercase">Loved by restaurants & cafés</p>
        <div className="grid grid-cols-2 items-center gap-y-6 sm:grid-cols-3 lg:grid-cols-5 lg:divide-x lg:divide-brand-200">
          {[
            { n: 'Le Jardin', c: 'font-serif text-3xl italic' },
            { n: 'CASA VERDE', c: 'text-lg font-extrabold tracking-[0.2em]' },
            { n: 'bistrø', c: 'text-3xl font-light lowercase' },
            { n: 'Olive & Co.', c: 'font-serif text-2xl font-semibold' },
            { n: 'NOMAD café', c: 'text-xl font-bold tracking-tight' },
          ].map((b) => (
            <span key={b.n} className={cn('text-center text-ink/45 transition hover:text-brand-800', b.c)}>
              {b.n}
            </span>
          ))}
        </div>
      </section>

      {/* Why */}
      <section id="features" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.6fr] lg:items-center">
          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-brand-700 uppercase">Why MENUQR?</p>
            <h2 className="mt-3 text-4xl leading-tight font-light sm:text-[44px]">
              A smarter way to share your <span className="font-bold text-brand-800">menu.</span>
            </h2>
            <p className="mt-4 text-ink-soft">Modern, easy and powerful — everything you need for a seamless dining experience.</p>
            <ButtonLink to={cta} variant="dark" className="mt-7 rounded-full" iconRight={<ArrowRight className="size-4" />}>
              Explore Features
            </ButtonLink>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              { icon: Zap, title: 'Create in Seconds', text: 'Turn your menu into a stunning digital experience instantly.' },
              { icon: Palette, title: 'Fully Customizable', text: 'Match your brand with elegant themes, colors and fonts.' },
              { icon: BarChart3, title: 'Track Performance', text: 'See scans and customer engagement in real-time.' },
            ].map((f) => (
              <div key={f.title} className="rounded-3xl border border-white bg-white/60 p-6 shadow-soft backdrop-blur transition hover:-translate-y-1 hover:shadow-lift">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-800">
                  <f.icon className="size-6" />
                </span>
                <h3 className="mt-6 font-bold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Paper vs digital */}
        <div className="mt-20 grid gap-5 lg:grid-cols-2">
          <div className="rounded-3xl border border-line bg-white/50 p-7">
            <p className="text-sm font-bold text-muted">Paper menus</p>
            <ul className="mt-4 space-y-3">
              {[
                'Reprint every time a price or dish changes',
                'Recurring printing & replacement costs',
                'Quickly outdated, stained or worn',
                'Professional design requires a designer',
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm text-ink-soft">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500">
                    <X className="size-3" strokeWidth={3} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-gradient-to-br from-brand-700 to-brand-900 p-7 text-white shadow-lift">
            <p className="text-sm font-bold text-white/70">With MENUQR</p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                { i: RefreshCw, t: 'Update prices instantly, live everywhere' },
                { i: Wallet, t: 'Print your QR once — save every month' },
                { i: ImageIcon, t: 'Mouth-watering photos for every dish' },
                { i: Smartphone, t: 'Opens on any phone, no app needed' },
                { i: Globe, t: 'One link to share on Instagram & Maps' },
                { i: Printer, t: 'Print-ready QR table cards' },
              ].map(({ i: Icon, t }) => (
                <li key={t} className="flex items-start gap-3 text-sm">
                  <Icon className="mt-0.5 size-4 shrink-0 text-brand-200" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="scroll-mt-24 pb-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
          <TableScene slug={demoSlug} />
          <div className="px-5 sm:px-8">
            <p className="text-xs font-bold tracking-[0.18em] text-brand-700 uppercase">How it works</p>
            <h2 className="mt-3 text-4xl font-light sm:text-[44px]">
              Get started in <span className="font-bold text-brand-800">3 simple steps.</span>
            </h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-3">
              {[
                { t: 'Create Your Menu', d: 'Add categories, dishes, prices and photos with our easy editor.' },
                { t: 'Generate Your QR Code', d: 'Get a unique QR code linked to your menu instantly.' },
                { t: 'Share & Impress', d: 'Print it on tables — guests scan and enjoy your digital menu.' },
              ].map((s, i) => (
                <div key={s.t} className="relative text-center sm:text-left">
                  <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-gradient-to-b from-brand-200 to-brand-100 text-lg font-semibold text-brand-800 shadow-soft ring-4 ring-white sm:mx-0">
                    {i + 1}
                  </span>
                  {i < 2 && <span className="absolute top-6 left-16 hidden h-px w-[calc(100%-3rem)] bg-gradient-to-r from-brand-300 to-transparent sm:block" />}
                  <h3 className="mt-4 font-bold">{s.t}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.d}</p>
                </div>
              ))}
            </div>
            <ButtonLink to={cta} className="mt-10 rounded-full" iconRight={<ArrowRight className="size-4" />}>
              Create your menu — it’s free
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="scroll-mt-24 bg-white/50 py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="text-center">
            <p className="text-xs font-bold tracking-[0.18em] text-brand-700 uppercase">Pricing</p>
            <h2 className="mt-3 text-4xl font-light sm:text-[44px]">
              Simple, <span className="font-bold text-brand-800">transparent</span> pricing.
            </h2>
            <p className="mt-3 text-ink-soft">Start free. Upgrade when your restaurant grows.</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                name: 'Starter',
                price: '$0',
                note: 'Free forever',
                features: ['1 published menu', 'Unlimited dishes', '5 elegant themes', 'QR code downloads (PNG & SVG)'],
                cta: 'Start for free',
              },
              {
                name: 'Pro',
                price: '$12',
                note: 'per month',
                featured: true,
                features: ['Unlimited menus', 'Advanced analytics', 'Custom brand colors & fonts', 'Remove MENUQR branding', 'Priority support'],
                cta: 'Start 14-day trial',
              },
              {
                name: 'Business',
                price: '$39',
                note: 'per month',
                features: ['Up to 10 locations', 'Team accounts & roles', 'Custom domain', 'Multi-language menus', 'Dedicated onboarding'],
                cta: 'Contact sales',
              },
            ].map((p) => (
              <div
                key={p.name}
                className={cn(
                  'relative flex flex-col rounded-3xl p-7',
                  p.featured ? 'bg-ink text-white shadow-lift md:-translate-y-3' : 'border border-line bg-white shadow-soft',
                )}
              >
                {p.featured && (
                  <span className="absolute -top-3 left-7 inline-flex items-center gap-1 rounded-full bg-brand-500 px-3 py-1 text-xs font-bold text-white">
                    <Crown className="size-3" /> Most popular
                  </span>
                )}
                <p className={cn('font-bold', p.featured ? 'text-brand-200' : 'text-brand-800')}>{p.name}</p>
                <p className="mt-4">
                  <span className="text-5xl font-bold">{p.price}</span>
                  <span className={cn('ml-1 text-sm', p.featured ? 'text-white/60' : 'text-muted')}>{p.note}</span>
                </p>
                <ul className="mt-6 flex-1 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check className={cn('mt-0.5 size-4 shrink-0', p.featured ? 'text-brand-300' : 'text-brand-600')} strokeWidth={2.5} />
                      <span className={p.featured ? 'text-white/85' : 'text-ink-soft'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <ButtonLink to={cta} variant={p.featured ? 'white' : 'secondary'} className="mt-8 w-full rounded-full">
                  {p.cta}
                </ButtonLink>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl scroll-mt-24 px-5 py-24 sm:px-8">
        <div className="text-center">
          <p className="text-xs font-bold tracking-[0.18em] text-brand-700 uppercase">FAQ</p>
          <h2 className="mt-3 text-4xl font-light sm:text-[44px]">
            Questions? <span className="font-bold text-brand-800">Answers.</span>
          </h2>
        </div>
        <div className="mt-10 space-y-3">
          {FAQ.map((f, i) => (
            <FaqItem key={f.q} q={f.q} a={f.a} defaultOpen={i === 0} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="relative flex flex-col items-start gap-6 overflow-hidden rounded-3xl bg-gradient-to-r from-brand-800 via-brand-700 to-brand-500 p-8 text-white shadow-lift sm:flex-row sm:items-center sm:p-10">
          <div className="absolute -top-20 -right-10 size-64 rounded-full bg-white/10 blur-2xl" />
          <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/15">
            <Crown className="size-7" />
          </span>
          <div className="hidden h-14 w-px bg-white/25 sm:block" />
          <div className="flex-1">
            <h2 className="text-2xl font-bold">Elevate the dining experience</h2>
            <p className="mt-1 text-white/80">Join thousands of restaurants already using MENUQR.</p>
          </div>
          <ButtonLink to={cta} variant="white" size="lg" className="relative rounded-full" iconRight={<ArrowRight className="size-4" />}>
            Get Started Free
          </ButtonLink>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto mt-16 max-w-7xl px-5 pb-10 sm:px-8">
        <div className="flex flex-col items-center justify-between gap-6 border-t border-brand-200/60 pt-8 md:flex-row">
          <Logo />
          <nav className="flex gap-8 text-sm text-ink-soft">
            {NAV_LINKS.filter((l) => l.href !== '#how').map((l) => (
              <a key={l.href} href={l.href} className="hover:text-ink">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {[InstagramIcon, XIcon, YoutubeIcon].map((Icon, i) => (
              <a key={i} href="#" onClick={(e) => e.preventDefault()} className="flex size-10 items-center justify-center rounded-full border border-line bg-white text-ink transition hover:border-brand-300 hover:text-brand-700" aria-label="Social link">
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-muted md:text-left">© {new Date().getFullYear()} MENUQR. All rights reserved.</p>
      </footer>
    </div>
  )
}

const FAQ = [
  { q: 'Do my customers need to download an app?', a: 'No. Customers simply scan the QR code with their phone camera and the menu opens instantly in their browser.' },
  { q: 'Can I update my menu after printing the QR code?', a: 'Yes — that’s the magic. Your QR code always points to the same link, so price changes, new dishes or sold-out items appear instantly without reprinting.' },
  { q: 'Do I need design or technical skills?', a: 'Not at all. Pick a theme, choose your colors and fonts, add your dishes — MENUQR handles the layout so it looks professional on every phone.' },
  { q: 'Can I have multiple menus?', a: 'Absolutely. Create separate menus for lunch, dinner, drinks or brunch, each with its own QR code and design.' },
  { q: 'Which currencies are supported?', a: 'USD, EUR, GBP, DZD, MAD and TND today — more are coming soon.' },
]

function FaqItem({ q, a, defaultOpen }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen)
  return (
    <div className={cn('rounded-2xl border bg-white transition', open ? 'border-brand-200 shadow-soft' : 'border-line')}>
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold" aria-expanded={open}>
        {q}
        <ChevronDown className={cn('size-5 shrink-0 text-muted transition', open && 'rotate-180 text-brand-700')} />
      </button>
      {open && <p className="animate-fade-in px-5 pb-5 text-sm leading-relaxed text-ink-soft">{a}</p>}
    </div>
  )
}

/** Photographic-feeling restaurant table with a real, scannable QR table tent. */
function TableScene({ slug }: { slug: string }) {
  return (
    <div className="relative h-[460px] overflow-hidden lg:rounded-r-[48px] lg:rounded-l-none">
      <img src="/images/hero-dish.jpg" alt="" className="absolute inset-0 size-full scale-125 object-cover blur-[10px]" />
      <div className="absolute inset-0 bg-gradient-to-br from-brand-200/50 via-[#2a1f4d]/30 to-brand-300/50" />
      {/* bokeh */}
      {[
        [15, 18, 60],
        [70, 12, 80],
        [85, 30, 40],
        [40, 8, 50],
      ].map(([x, y, s], i) => (
        <span key={i} className="absolute rounded-full bg-amber-100/40 blur-md" style={{ left: `${x}%`, top: `${y}%`, width: s, height: s }} />
      ))}
      {/* marble table */}
      <div
        className="absolute inset-x-0 bottom-0 h-[42%]"
        style={{
          background:
            'radial-gradient(120% 60% at 30% 0%, rgba(255,255,255,.95), transparent 70%), linear-gradient(170deg, #f7f5fa 0%, #e8e4ef 60%, #d9d4e3 100%)',
        }}
      >
        <svg className="absolute inset-0 size-full opacity-25" preserveAspectRatio="none" viewBox="0 0 400 200" aria-hidden>
          <path d="M0 60 C 80 40, 120 110, 220 80 S 360 120, 400 90" stroke="#9a92ad" fill="none" strokeWidth=".8" />
          <path d="M0 150 C 60 120, 160 170, 260 140 S 380 160, 400 150" stroke="#a69fb8" fill="none" strokeWidth=".6" />
        </svg>
      </div>
      <Foliage className="absolute bottom-[30%] left-[4%] w-32 opacity-90" />
      {/* glass */}
      <div className="absolute right-[12%] bottom-[30%] flex flex-col items-center opacity-80">
        <div className="h-20 w-14 rounded-b-[40%] border border-white/70 bg-white/25 backdrop-blur-sm" />
        <div className="h-12 w-0.5 bg-white/70" />
        <div className="h-1 w-10 rounded-full bg-white/70" />
      </div>
      {/* table tent */}
      <div className="absolute bottom-[18%] left-1/2 -translate-x-1/2" style={{ perspective: 800 }}>
        <div className="w-52 rounded-t-xl bg-gradient-to-b from-white to-[#f1eff6] px-5 pt-5 pb-6 text-center shadow-[0_30px_40px_-20px_rgba(36,26,82,0.55)]" style={{ transform: 'rotateX(8deg)' }}>
          <LeafMark className="mx-auto size-8 text-ink" />
          <p className="font-serif text-2xl text-ink">Le Jardin</p>
          <div className="mx-auto mt-3 w-28 rounded-lg bg-white p-1.5">
            <QRCodeSVG value={publicMenuUrl(slug)} size={100} fgColor="#1b1735" marginSize={0} className="h-auto w-full" />
          </div>
          <p className="mt-3 text-xs font-semibold text-ink-soft">Scan for Menu</p>
          <span className="mx-auto mt-1.5 block h-0.5 w-10 rounded-full bg-brand-400" />
        </div>
      </div>
      <span className="absolute right-4 bottom-4 inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold text-ink backdrop-blur">
        <QrCode className="size-3.5" /> Try scanning it!
      </span>
    </div>
  )
}
