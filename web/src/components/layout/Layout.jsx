import { Outlet, NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { api } from '../../api/client'
import { useStore } from '../../store/useStore'
import {
  Home,
  UtensilsCrossed,
  Sparkles,
  ShoppingBag,
  Package,
  X,
} from 'lucide-react'

const MOBILE = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/menu', label: 'Menu', icon: UtensilsCrossed },
  { to: '/ai-lounge', label: 'Lounge', icon: Sparkles },
  { to: '/cart', label: 'Cart', icon: ShoppingBag },
  { to: '/orders', label: 'Orders', icon: Package },
]

export default function Layout() {
  const setBackendOnline = useStore((s) => s.setBackendOnline)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let alive = true
    const ping = async () => {
      const ok = await api.isOnline()
      if (alive) setBackendOnline(ok)
    }
    ping()
    const id = setInterval(ping, 12000)
    return () => {
      alive = false
      clearInterval(id)
    }
  }, [setBackendOnline])

  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar />

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-label="Close overlay"
          />
          <div className="absolute left-0 top-0 flex h-full w-[80%] max-w-xs flex-col bg-cream p-4 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-serif text-xl font-bold text-[#5b7553]">FoodVerse</span>
              <button type="button" onClick={() => setOpen(false)} className="rounded-xl p-2">
                <X size={18} />
              </button>
            </div>
            <nav className="flex flex-col gap-2">
              {MOBILE.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-2xl px-3 py-3 font-semibold ${
                      isActive ? 'bg-orange/10 text-orange' : 'text-ink'
                    }`
                  }
                >
                  <Icon size={18} />
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenNav={() => setOpen(true)} />
        <main className="mx-auto w-full max-w-[1320px] flex-1 px-4 pb-24 md:px-6 md:pb-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
