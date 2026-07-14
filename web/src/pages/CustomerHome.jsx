import { Link } from 'react-router-dom'
import { ShoppingBag, Sparkles, UtensilsCrossed, Package, ArrowRight } from 'lucide-react'
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
      desc: 'Chef-curated dishes ready to order',
      icon: UtensilsCrossed,
      tone: 'from-orange/20 to-orange/5 text-orange',
    },
    {
      to: '/cart',
      title: 'Your Cart',
      desc: cartCount ? `${cartCount} item${cartCount > 1 ? 's' : ''} waiting` : 'Cart is empty',
      icon: ShoppingBag,
      tone: 'from-amber-100 to-amber-50 text-amber-700',
    },
    {
      to: '/orders',
      title: 'Track Orders',
      desc: activeOrderId ? `Active: ${activeOrderId}` : 'No active order',
      icon: Package,
      tone: 'from-[#00a600]/15 to-[#00a600]/5 text-[#00a600]',
    },
    {
      to: '/ai-lounge',
      title: 'AI Lounge',
      desc: 'Chat with your food companions',
      icon: Sparkles,
      tone: 'from-violet-100 to-violet-50 text-violet-700',
    },
  ]

  return (
    <PageShell className="space-y-8 py-4 md:py-6">
      <GlassCard
        strong
        hover={false}
        className="relative overflow-hidden p-7 md:p-9"
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-orange/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-10 h-48 w-48 rounded-full bg-[#00a600]/15 blur-3xl" />
        <p className="relative text-xs font-bold uppercase tracking-[0.16em] text-muted">
          Customer dashboard
        </p>
        <h1 className="relative mt-2 font-serif text-4xl font-semibold text-ink md:text-5xl">
          Hey {name}, hungry?
        </h1>
        <p className="relative mt-3 max-w-xl text-muted">
          Order from the menu, track delivery, or hang out in the AI Lounge — all in one place.
        </p>
        <div className="relative mt-6 flex flex-wrap gap-3">
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange to-[#ff7a45] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange/25 transition hover:scale-105"
          >
            Order now <ArrowRight size={16} />
          </Link>
          <Link
            to="/ai-lounge"
            className="rounded-full border border-border bg-white/70 px-6 py-2.5 text-sm font-bold text-ink backdrop-blur transition hover:border-orange/30"
          >
            Open AI Lounge
          </Link>
        </div>
      </GlassCard>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ to, title, desc, icon: Icon, tone }, i) => (
          <GlassCard key={to} delay={0.05 * i} className="p-5">
            <Link to={to} className="block h-full">
              <div
                className={`mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br ${tone}`}
              >
                <Icon size={20} />
              </div>
              <h2 className="font-semibold text-ink">{title}</h2>
              <p className="mt-1 text-sm text-muted">{desc}</p>
            </Link>
          </GlassCard>
        ))}
      </div>
    </PageShell>
  )
}
