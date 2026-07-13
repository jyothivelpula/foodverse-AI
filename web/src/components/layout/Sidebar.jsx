import { NavLink } from 'react-router-dom'
import {
  Home,
  UtensilsCrossed,
  Sparkles,
  ShoppingBag,
  Package,
  User,
  Settings,
  Heart,
} from 'lucide-react'
import { useStore } from '../../store/useStore'

const NAV = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/menu', label: 'Menu', icon: UtensilsCrossed },
  { to: '/ai-lounge', label: 'AI Lounge', icon: Sparkles },
  { to: '/cart', label: 'Cart', icon: ShoppingBag },
  { to: '/orders', label: 'Orders', icon: Package },
  { to: '/favorites', label: 'Favorites', icon: Heart },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  const cart = useStore((s) => s.cart)
  const cartCount = cart.reduce((n, i) => n + i.quantity, 0)
  const customer = useStore((s) => s.customer)
  const online = useStore((s) => s.backendOnline)
  const first = (customer.name || 'Guest').split(' ')[0]

  return (
    <aside className="hidden md:flex w-[248px] shrink-0 flex-col border-r border-[#ebe4d8] bg-cream px-3.5 py-5 sticky top-0 h-screen">
      <div className="flex items-center gap-3 px-2 pb-5">
        <div className="grid h-11 w-11 place-items-center rounded-full bg-orange text-white shadow-lg shadow-orange/30 text-lg">
          🍽
        </div>
        <div>
          <div className="font-serif text-lg font-bold text-[#5b7553]">FoodVerse</div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            AI Kitchen
          </div>
        </div>
      </div>

      <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-gray-400">
        Main
      </p>
      <nav className="flex flex-col gap-1.5 flex-1">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `relative flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition ${
                isActive
                  ? 'bg-orange/10 text-orange'
                  : 'text-ink hover:bg-orange/5 hover:translate-x-0.5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r bg-orange" />
                )}
                <Icon size={18} strokeWidth={2.2} />
                <span className="flex-1">{label}</span>
                {to === '/cart' && cartCount > 0 && (
                  <span className="rounded-full bg-orange px-2 py-0.5 text-[11px] text-white">
                    {cartCount}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-border bg-white p-3 shadow-sm">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-orange font-bold text-white">
          {first.slice(0, 1).toUpperCase()}
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-bold">{first}</div>
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <span
              className={`h-2 w-2 rounded-full ${online ? 'bg-green-500' : 'bg-red-400'}`}
            />
            {online ? 'API Online' : online === false ? 'API Offline' : 'Checking…'}
          </div>
        </div>
      </div>
    </aside>
  )
}
