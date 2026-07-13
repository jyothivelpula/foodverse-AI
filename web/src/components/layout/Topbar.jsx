import { Link, useNavigate } from 'react-router-dom'
import { Bell, Search, ShoppingBag, Menu } from 'lucide-react'
import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { api } from '../../api/client'

export default function Topbar({ onOpenNav }) {
  const navigate = useNavigate()
  const cart = useStore((s) => s.cart)
  const cartCount = cart.reduce((n, i) => n + i.quantity, 0)
  const customer = useStore((s) => s.customer)
  const online = useStore((s) => s.backendOnline)
  const setBackendOnline = useStore((s) => s.setBackendOnline)
  const [q, setQ] = useState('')

  const search = (e) => {
    e.preventDefault()
    navigate(`/menu?q=${encodeURIComponent(q.trim())}`)
  }

  const recheck = async () => {
    setBackendOnline(await api.isOnline())
  }

  return (
    <header className="sticky top-0 z-30 mb-4 border-b border-border/70 bg-cream/85 backdrop-blur-md">
      <div className="flex items-center gap-3 px-4 py-3 md:px-6">
        <button
          type="button"
          className="md:hidden rounded-xl border border-border bg-white p-2.5 shadow-sm"
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
            className="h-12 w-full rounded-full border border-border bg-white/80 pl-11 pr-4 text-sm shadow-sm outline-none transition focus:border-orange/50 focus:ring-4 focus:ring-orange/10"
          />
        </form>

        <button
          type="button"
          onClick={recheck}
          className={`hidden sm:inline-flex h-10 items-center rounded-full border px-3 text-xs font-bold ${
            online
              ? 'border-green-200 bg-green-50 text-green-700'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {online ? '● API Online' : '○ API Offline'}
        </button>

        <Link
          to="/orders"
          className="grid h-12 w-12 place-items-center rounded-2xl border border-border bg-white shadow-sm transition hover:-translate-y-0.5"
        >
          <Bell size={18} />
        </Link>

        <Link
          to="/cart"
          className="relative grid h-12 w-12 place-items-center rounded-2xl border border-border bg-white shadow-sm transition hover:-translate-y-0.5"
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
          className="hidden sm:grid h-12 w-12 place-items-center rounded-full bg-orange text-sm font-bold text-white shadow-md shadow-orange/30"
          title={customer.name}
        >
          {(customer.name || 'G').slice(0, 1).toUpperCase()}
        </Link>
      </div>
    </header>
  )
}
