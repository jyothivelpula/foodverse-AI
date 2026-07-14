import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Home,
  UtensilsCrossed,
  Sparkles,
  ShoppingBag,
  Package,
  User,
  LogOut,
} from 'lucide-react'
import { useStore } from '../../store/useStore'

const NAV = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/menu', label: 'Menu', icon: UtensilsCrossed },
  { to: '/cart', label: 'Cart', icon: ShoppingBag },
  { to: '/orders', label: 'Orders', icon: Package },
  { to: '/ai-lounge', label: 'AI Lounge', icon: Sparkles },
  { to: '/profile', label: 'Profile', icon: User },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const cart = useStore((s) => s.cart)
  const cartCount = cart.reduce((n, i) => n + i.quantity, 0)
  const user = useStore((s) => s.user)
  const customer = useStore((s) => s.customer)
  const logout = useStore((s) => s.logout)
  const online = useStore((s) => s.backendOnline)
  const first = (user?.name || customer.name || 'Guest').split(' ')[0]

  const onLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <aside className="glass-strong sticky top-0 hidden h-screen w-[260px] shrink-0 flex-col border-r border-border/80 px-3.5 py-5 md:flex">
      <div className="flex items-center gap-3 px-2 pb-6">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-orange to-[#ff8a55] text-lg text-white shadow-lg shadow-orange/35">
          🍽
        </div>
        <div>
          <div className="font-serif text-lg font-bold text-[#00a600]">FoodVerse</div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            AI Kitchen
          </div>
        </div>
      </div>

      <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-muted/70">
        Navigate
      </p>
      <nav className="flex flex-1 flex-col gap-1.5">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/home'}
            className={({ isActive }) =>
              `relative flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition ${
                isActive
                  ? 'bg-gradient-to-r from-orange/15 to-[#00a600]/10 text-orange shadow-sm'
                  : 'text-ink hover:translate-x-0.5 hover:bg-white/50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r bg-orange"
                  />
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

      <button
        type="button"
        onClick={onLogout}
        className="mb-3 flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-muted transition hover:bg-red-50 hover:text-red-600"
      >
        <LogOut size={18} />
        Sign out
      </button>

      <div className="glass flex items-center gap-3 rounded-2xl p-3">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-orange to-[#00a600] font-bold text-white">
          {first.slice(0, 1).toUpperCase()}
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-bold">{first}</div>
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <span
              className={`h-2 w-2 rounded-full ${online ? 'bg-[#00a600]' : 'bg-red-400'}`}
            />
            {online ? 'API Online' : online === false ? 'API Offline' : 'Checking…'}
          </div>
        </div>
      </div>
    </aside>
  )
}
