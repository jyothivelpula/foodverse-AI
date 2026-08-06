import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock3, Sparkles, UtensilsCrossed } from 'lucide-react'
import FoodCard from '../components/food/FoodCard'
import { CATEGORIES } from '../data/menu'
import { useStore } from '../store/useStore'
import EmptyState from '../components/ui/EmptyState'
import PageShell from '../components/ui/PageShell'
import { MenuSkeletonGrid } from '../components/ui/Skeleton'

export default function Menu() {
  const [params] = useSearchParams()
  const initialQ = params.get('q') || ''
  const [categoryId, setCategoryId] = useState(null)
  const [q, setQ] = useState(initialQ)
  const [booting, setBooting] = useState(true)
  const menuItems = useStore((s) => s.menuItems)
  const cart = useStore((s) => s.cart)
  const cartSubtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const updateQty = useStore((s) => s.updateQty)
  const removeFromCart = useStore((s) => s.removeFromCart)

  useEffect(() => {
    const t = window.setTimeout(() => setBooting(false), 450)
    return () => clearTimeout(t)
  }, [])

  const items = useMemo(() => {
    let list = [...menuItems]
    if (categoryId != null) list = list.filter((i) => i.categoryId === categoryId)
    const query = q.trim().toLowerCase()
    if (query) {
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(query) ||
          i.description.toLowerCase().includes(query),
      )
    }
    return list
  }, [menuItems, categoryId, q])

  return (
    <PageShell className="space-y-8">
      <section className="overflow-hidden rounded-[30px] bg-gradient-to-br from-[#fff7ef] via-white to-[#f5ede4] p-5 shadow-[0_20px_58px_rgba(37,33,29,0.08)] md:p-7">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-orange/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-orange">
              <Sparkles size={12} />
              curated dining
            </div>
            <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight text-ink md:text-5xl">
              The Menu
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
              Discover chef-selected comfort classics, signature mains, and premium desserts,
              all arranged for a faster, sharper ordering experience.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                ['1. Pick', 'Browse your cuisine'],
                ['2. Order', 'Live prep progression'],
                ['3. Lounge', 'Chat while it cooks'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-white/20 px-4 py-3 shadow-sm ring-1 ring-border/80">
                  <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-orange">
                    {label}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-ink">{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-white/80 bg-white/85 p-4 shadow-[0_18px_40px_rgba(37,33,29,0.08)] backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-orange">
                  kitchen pulse
                </div>
                <div className="mt-1 font-serif text-2xl font-semibold text-ink">Live dine flow</div>
              </div>
              <div className="rounded-full bg-[#f8efe7] px-3 py-1 text-[11px] font-bold text-muted">
                20 min avg.
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-[#fff6f0] p-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-orange">
                  <UtensilsCrossed size={13} />
                  Signature dishes
                </div>
                <div className="mt-2 text-2xl font-bold text-ink">{menuItems.length}</div>
              </div>
              <div className="rounded-2xl bg-[#f7f3ec] p-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-brand">
                  <Clock3 size={13} />
                  Freshness
                </div>
                <div className="mt-2 text-2xl font-bold text-ink">12–25 min</div>
              </div>
            </div>

            <div className="mt-3 rounded-2xl bg-[#f7f3ec] p-3 text-sm text-muted">
              Chef-crafted menus with real-time order visibility and AI companionship through the
              cooking cycle.
            </div>
          </div>
        </div>
      </section>

      <div className="rounded-[28px] border border-white/70 bg-white/75 p-4 shadow-[0_18px_40px_rgba(37,33,29,0.06)] backdrop-blur md:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCategoryId(null)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                categoryId == null
                  ? 'bg-orange text-white shadow-md shadow-orange/25'
                  : 'bg-[#f7f2ea] text-muted hover:text-ink'
              }`}
            >
              All
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategoryId(c.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  categoryId === c.id
                    ? 'bg-orange text-white shadow-md shadow-orange/25'
                    : 'bg-[#f7f2ea] text-muted hover:text-ink'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search dishes..."
            className="h-12 w-full rounded-full border border-border bg-[#fcfaf7] px-5 text-sm outline-none transition focus:border-orange/40 focus:ring-4 focus:ring-orange/10 lg:max-w-xs"
          />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-muted">
              {items.length} dish{items.length === 1 ? '' : 'es'} available
            </p>
            <span className="rounded-full bg-[#f7f2ea] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-brand">
              {categoryId == null ? 'all categories' : `category ${categoryId}`}
            </span>
          </div>
          {booting ? (
            <MenuSkeletonGrid />
          ) : items.length === 0 ? (
            <EmptyState
              illustration="search"
              title="No dishes found"
              hint="Try another category or search term."
              actionLabel="Clear filters"
              action={() => {
                setCategoryId(null)
                setQ('')
              }}
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <FoodCard key={item.id} item={item} compact />
              ))}
            </div>
          )}
        </div>

        <aside className="glass-strong h-fit rounded-[28px] p-4 lg:sticky lg:top-24">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-semibold">Your Cart</h3>
            <span className="rounded-full bg-[#f8efe7] px-2.5 py-1 text-[11px] font-bold text-orange">
              {cart.length} items
            </span>
          </div>

          {cart.length === 0 ? (
            <div className="mt-4 rounded-2xl bg-[#faf6f1] p-4 text-sm text-muted">
              Cart is empty. Add a chef pick and build your order.
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {cart.map((c) => (
                <li key={c.id} className="rounded-2xl bg-white/85 p-3 ring-1 ring-border/80">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-ink">{c.name}</div>
                    <div className="text-xs font-bold text-orange">₹{c.price}</div>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted">
                    <span>Quantity</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="grid h-6 w-6 place-items-center rounded-full border border-border bg-white text-sm font-bold"
                        onClick={() => updateQty(c.id, c.quantity - 1)}
                      >
                        −
                      </button>
                      <span className="min-w-4 text-center font-semibold text-ink">{c.quantity}</span>
                      <button
                        type="button"
                        className="grid h-6 w-6 place-items-center rounded-full border border-border bg-white text-sm font-bold"
                        onClick={() => updateQty(c.id, c.quantity + 1)}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        className="ml-1 text-red-500"
                        onClick={() => removeFromCart(c.id)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-sm font-bold">
            <span>Subtotal</span>
            <span>₹{cartSubtotal.toFixed(0)}</span>
          </div>
          <Link
            to="/cart"
            className="mt-3 flex w-full items-center justify-center rounded-full bg-gradient-to-r from-orange to-[#ff8575] py-2.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(201,92,54,0.25)]"
          >
            View Cart
          </Link>
        </aside>
      </div>
    </PageShell>
  )
}
