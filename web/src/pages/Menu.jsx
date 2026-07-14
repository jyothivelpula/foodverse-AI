import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
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
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ['1. Pick your food', 'Browse our chef-curated menu.'],
          ['2. Place the order', 'Live preparation timer.'],
          ['3. Chat with AI', 'Chat with AI companions while waiting.'],
        ].map(([t, d], i) => (
          <motion.div
            key={t}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -4 }}
            className="glass rounded-[22px] p-5"
          >
            <h4 className="font-bold text-orange">{t}</h4>
            <p className="mt-1 text-sm text-muted">{d}</p>
          </motion.div>
        ))}
      </div>

      <div>
        <h1 className="font-serif text-4xl font-semibold md:text-5xl">The Menu</h1>
        <p className="mt-1 text-muted">Freshly imagined, made to order.</p>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategoryId(null)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              categoryId == null
                ? 'bg-orange text-white shadow-md shadow-orange/25'
                : 'glass text-muted hover:text-ink'
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
                  : 'glass text-muted hover:text-ink'
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
          className="glass h-12 w-full rounded-full px-5 text-sm outline-none focus:border-orange/40 focus:ring-4 focus:ring-orange/10 lg:max-w-xs"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        <div>
          <p className="mb-4 text-sm text-muted">
            {items.length} dish{items.length === 1 ? '' : 'es'} available
          </p>
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
                <FoodCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        <aside className="glass-strong h-fit rounded-[24px] p-4 lg:sticky lg:top-24">
          <h3 className="font-serif text-xl font-semibold">Your Cart</h3>
          {cart.length === 0 ? (
            <p className="mt-3 text-sm text-muted">Cart is empty.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {cart.map((c) => (
                <li key={c.id} className="glass rounded-xl p-3">
                  <div className="text-sm font-semibold">{c.name}</div>
                  <div className="mt-1 flex items-center justify-between text-xs text-muted">
                    <span>₹{c.price}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="h-6 w-6 rounded-full border border-border"
                        onClick={() => updateQty(c.id, c.quantity - 1)}
                      >
                        −
                      </button>
                      <span>{c.quantity}</span>
                      <button
                        type="button"
                        className="h-6 w-6 rounded-full border border-border"
                        onClick={() => updateQty(c.id, c.quantity + 1)}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        className="text-red-500"
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
            className="mt-3 flex w-full items-center justify-center rounded-full bg-gradient-to-r from-orange to-[#ff7a45] py-2.5 text-sm font-bold text-white"
          >
            View Cart
          </Link>
        </aside>
      </div>
    </PageShell>
  )
}
