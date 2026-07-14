import { Outlet, NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ChefSidebar from './ChefSidebar'
import { api } from '../../api/client'
import { useStore } from '../../store/useStore'
import { useKitchenFeed } from '../../hooks/useOrderRealtime'
import {
  LayoutDashboard,
  Clock3,
  Flame,
  CircleCheck,
  ChartColumn,
  X,
  Menu,
} from 'lucide-react'

const MOBILE = [
  { to: '/chef', label: 'Dash', icon: LayoutDashboard, end: true },
  { to: '/chef/pending', label: 'Pending', icon: Clock3 },
  { to: '/chef/active', label: 'Active', icon: Flame },
  { to: '/chef/completed', label: 'Done', icon: CircleCheck },
  { to: '/chef/analytics', label: 'Stats', icon: ChartColumn },
]

export default function ChefLayout() {
  const setBackendOnline = useStore((s) => s.setBackendOnline)
  const [open, setOpen] = useState(false)
  useKitchenFeed(true)

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
    <div className="flex min-h-screen bg-transparent">
      <ChefSidebar />

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
              <span className="font-serif text-xl font-bold text-[#00a600]">FoodVerse Chef</span>
              <button type="button" onClick={() => setOpen(false)} className="rounded-xl p-2">
                <X size={18} />
              </button>
            </div>
            <nav className="flex flex-col gap-2">
              {MOBILE.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={!!end}
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
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border/60 bg-cream/70 px-4 backdrop-blur-xl md:px-6">
          <button
            type="button"
            className="glass rounded-xl p-2 md:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
          <div className="font-serif text-lg font-semibold text-ink">
            <span className="text-[#00a600]">FoodVerse</span>
            <span className="text-muted"> · </span>
            <span className="text-orange">Kitchen</span>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1320px] flex-1 px-4 pb-24 md:px-6 md:pb-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
