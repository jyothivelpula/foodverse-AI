import { Link, useNavigate } from 'react-router-dom'
import { Bell, Search, ShoppingBag, Menu, Wifi, WifiOff } from 'lucide-react'
import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { api } from '../../api/client'
import NotificationCenter from '../notifications/NotificationCenter'

export default function Topbar({ onOpenNav }) {
  const navigate = useNavigate()
  const cart = useStore((s) => s.cart)
  const cartCount = cart.reduce((n, i) => n + i.quantity, 0)
  const customer = useStore((s) => s.customer)
  const online = useStore((s) => s.backendOnline)
  const setBackendOnline = useStore((s) => s.setBackendOnline)
  const notifications = useStore((s) => s.notifications)
  const unread = notifications.filter((n) => !n.read).length
  const toggleNotificationCenter = useStore((s) => s.toggleNotificationCenter)
  const [q, setQ] = useState('')

  const search = (e) => {
    e.preventDefault()
    navigate(`/menu?q=${encodeURIComponent(q.trim())}`)
  }

  const recheck = async () => {
    setBackendOnline(await api.isOnline())
  }

  return (
    <header className="sticky top-0 z-30 mb-5 border-b border-border/60 bg-cream/70 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-4 py-3.5 md:px-6">
        <button
          type="button"
          className="glass rounded-2xl p-2.5 md:hidden"
          onClick={onOpenNav}
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>

        <form onSubmit={search} className="relative flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search biryani, pizza, desserts..."
            className="glass h-12 w-full rounded-full pl-11 pr-4 text-sm outline-none transition focus:border-orange/40 focus:ring-4 focus:ring-orange/10"
          />
        </form>

        <button
          type="button"
          onClick={recheck}
          className={`hidden h-10 items-center gap-1.5 rounded-full border px-3 text-xs font-bold sm:inline-flex ${
            online
              ? 'border-[#00a600]/25 bg-[#00a600]/10 text-[#00a600]'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {online ? <Wifi size={14} /> : <WifiOff size={14} />}
          {online ? 'Online' : 'Offline'}
        </button>

        <button
          type="button"
          onClick={toggleNotificationCenter}
          className="glass relative grid h-12 w-12 place-items-center rounded-2xl transition hover:-translate-y-0.5"
          aria-label="Open notifications"
        >
          <Bell size={18} />
          {unread > 0 && (
            <span className="absolute -right-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-orange px-1 text-[10px] font-bold text-white">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </button>

        <Link
          to="/cart"
          className="glass relative grid h-12 w-12 place-items-center rounded-2xl transition hover:-translate-y-0.5"
        >
          <ShoppingBag size={18} />
          {cartCount > 0 && (
            <span className="absolute -right-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-orange px-1 text-[10px] font-bold text-white">
              {cartCount}
            </span>
          )}
        </Link>

        <Link
          to="/profile"
          className="hidden h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-orange to-[#00a600] text-sm font-bold text-white shadow-md shadow-orange/25 sm:grid"
          title={customer.name}
        >
          {(customer.name || 'G').slice(0, 1).toUpperCase()}
        </Link>
      </div>
      <NotificationCenter />
    </header>
  )
}
