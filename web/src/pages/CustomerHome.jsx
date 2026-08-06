import { Link } from 'react-router-dom'
import {
  ShoppingBag,
  Sparkles,
  UtensilsCrossed,
  Package,
  ArrowRight,
  Clock3,
  ChefHat,
  Flame,
} from 'lucide-react'
import { useStore } from '../store/useStore'
import GlassCard from '../components/ui/GlassCard'
import PageShell from '../components/ui/PageShell'

export default function CustomerHome() {
  const user = useStore((s) => s.user)
  const cart = useStore((s) => s.cart)
  const activeOrderId = useStore((s) => s.activeOrderId)
  const cartCount = cart.reduce((n, i) => n + i.quantity, 0)
  const name = (user?.name || 'Guest').split(' ')[0]

  const cards = [
    {
      to: '/menu',
      title: 'Browse Menu',
      desc: 'Explore today’s chef-curated selection',
      foot: '24 dishes to discover',
      icon: UtensilsCrossed,
      tone: 'from-[#f1e3ca] to-[#faf4ea] text-[#94733f]',
    },
    {
      to: '/cart',
      title: 'Your Cart',
      desc: cartCount ? `${cartCount} item${cartCount > 1 ? 's' : ''} ready for you` : 'Your selections will appear here',
      foot: cartCount ? 'Ready to review' : 'Start your order',
      icon: ShoppingBag,
      tone: 'from-[#eee8dd] to-[#faf8f3] text-[#6e6457]',
    },
    {
      to: '/orders',
      title: 'Track Orders',
      desc: activeOrderId ? `Order ${activeOrderId} is in progress` : 'No order is currently in progress',
      foot: activeOrderId ? 'See live progress' : 'Place an order to begin',
      icon: Package,
      tone: 'from-[#e9eee5] to-[#f7f8f3] text-[#657654]',
    },
    {
      to: '/ai-lounge',
      title: 'AI Lounge',
      desc: 'Thoughtful conversation while you wait',
      foot: 'Meet your AI guides',
      icon: Sparkles,
      tone: 'from-[#eee9e0] to-[#faf8f3] text-[#806b4d]',
    },
  ]

  return (
    <PageShell className="space-y-6 py-4 md:py-6">
      <GlassCard strong hover={false} className="relative overflow-hidden p-7 md:p-9">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#d8b77d]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-10 h-48 w-48 rounded-full bg-[#e9eee5] blur-3xl" />
        <div className="pointer-events-none absolute right-8 top-5 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/85 backdrop-blur">
          Premium guest access
        </div>

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
              Your dining dashboard
            </p>
            <h1 className="mt-2 font-serif text-[2.35rem] font-semibold leading-[1.02] text-ink md:text-[3.25rem]">
              Welcome back, {name}.
            </h1>
            <p className="mt-3 max-w-xl text-sm text-muted md:text-base">
              Order from the menu, track delivery, or explore your AI kitchen concierge — all in one refined experience.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#a7834d] to-[#c9a86d] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#b8955b]/25 transition hover:scale-[1.02]"
              >
                Explore menu <ArrowRight size={16} />
              </Link>
              <Link
                to="/ai-lounge"
                className="rounded-full border border-border bg-white/80 px-6 py-2.5 text-sm font-bold text-ink backdrop-blur transition hover:border-[#b8955b]/40 hover:text-[#94733f]"
              >
                Meet your AI guide
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[380px]">
            <div className="rounded-2xl border border-border/80 bg-white/75 p-3.5 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
                <Clock3 size={14} /> Live
              </div>
              <div className="mt-2 text-2xl font-bold text-ink">18 min</div>
              <p className="mt-1 text-xs text-muted">Typical delivery time</p>
            </div>
            <div className="rounded-2xl border border-border/80 bg-white/75 p-3.5 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
                <Flame size={14} /> Chef’s pick
              </div>
              <div className="mt-2 text-2xl font-bold text-ink">Truffle</div>
              <p className="mt-1 text-xs text-muted">Featured dish this week</p>
            </div>
            <div className="rounded-2xl border border-border/80 bg-white/75 p-3.5 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
                <ChefHat size={14} /> AI match
              </div>
              <div className="mt-2 text-2xl font-bold text-ink">92%</div>
              <p className="mt-1 text-xs text-muted">Preference match rate</p>
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ to, title, desc, foot, icon: Icon, tone }, i) => (
          <GlassCard key={to} delay={0.05 * i} className="group p-5">
            <Link to={to} className="block h-full">
              <div className="flex items-start justify-between gap-3">
                <div
                  className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${tone} shadow-sm`}
                >
                  <Icon size={20} />
                </div>
                <span className="rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-muted shadow-sm">
                  {i === 0 ? 'Start' : i === 1 ? 'Cart' : i === 2 ? 'Track' : 'Assist'}
                </span>
              </div>
              <h2 className="mt-4 font-serif text-[1.45rem] font-semibold leading-none text-ink">{title}</h2>
              <p className="mt-2 text-[13px] font-medium leading-relaxed text-muted">{desc}</p>
              <div className="mt-4 flex items-center justify-between border-t border-border/70 pt-3">
                <span className="text-xs font-semibold text-ink/80">{foot}</span>
                <span className="rounded-full bg-[#f4ead9] p-1.5 text-[#94733f] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          </GlassCard>
        ))}
      </div>
    </PageShell>
  )
}
