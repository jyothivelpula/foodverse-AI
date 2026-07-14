import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Clock3,
  Flame,
  CircleCheck,
  ChartColumn,
  User,
  LogOut,
} from 'lucide-react'
import { useStore } from '../../store/useStore'

const NAV = [
  { to: '/chef', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/chef/pending', label: 'Pending Orders', icon: Clock3 },
  { to: '/chef/active', label: 'Active Orders', icon: Flame },
  { to: '/chef/completed', label: 'Completed Orders', icon: CircleCheck },
  { to: '/chef/analytics', label: 'Analytics', icon: ChartColumn },
  { to: '/chef/profile', label: 'Profile', icon: User },
]

export default function ChefSidebar() {
  const navigate = useNavigate()
  const user = useStore((s) => s.user)
  const logout = useStore((s) => s.logout)
  const kitchenOrders = useStore((s) => s.kitchenOrders)
  const online = useStore((s) => s.backendOnline)
  const first = (user?.name || 'Chef').split(' ')[0]
  const pendingCount = kitchenOrders.filter((o) => o.status === 'pending').length

  const onLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <aside className="glass-strong sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col border-r border-border/80 px-3.5 py-5 md:flex">
      <div className="flex items-center gap-3 px-2 pb-5">
        <div className="grid h-11 w-11 place-items-center rounded-full bg-ink text-white shadow-lg text-sm font-bold">
          FV
        </div>
        <div>
          <div className="font-serif text-lg font-bold text-[#00a600]">FoodVerse</div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            Chef Kitchen
          </div>
        </div>
      </div>

      <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-gray-400">
        Kitchen
      </p>
      <nav className="flex flex-col gap-1.5 flex-1">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={!!end}
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
                {to === '/chef/pending' && pendingCount > 0 && (
                  <span className="rounded-full bg-orange px-2 py-0.5 text-[11px] text-white">
                    {pendingCount}
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
        className="mb-3 flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-muted hover:bg-red-50 hover:text-red-600"
      >
        <LogOut size={18} />
        Sign out
      </button>

      <div className="flex items-center gap-3 rounded-2xl border border-border bg-white p-3 shadow-sm">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-ink font-bold text-white">
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
