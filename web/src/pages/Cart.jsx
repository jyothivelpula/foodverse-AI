import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useStore } from '../store/useStore'
import EmptyState from '../components/ui/EmptyState'
import PageShell from '../components/ui/PageShell'
import GlassCard from '../components/ui/GlassCard'

export default function Cart() {
  const navigate = useNavigate()
  const cart = useStore((s) => s.cart)
  const updateQty = useStore((s) => s.updateQty)
  const removeFromCart = useStore((s) => s.removeFromCart)
  const cartSubtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <PageShell className="mx-auto max-w-3xl space-y-6">
      <h1 className="font-serif text-4xl font-semibold">Your Cart</h1>
      {cart.length === 0 ? (
        <EmptyState
          illustration="cart"
          title="Your cart is empty"
          hint="Browse the menu and add something delicious."
          actionLabel="Browse Menu"
          action={() => navigate('/menu')}
        />
      ) : (
        <>
          <ul className="space-y-3">
            {cart.map((c, i) => (
              <GlassCard key={c.id} delay={i * 0.04} className="flex flex-wrap items-center gap-4 p-4">
                {c.image && (
                  <img src={c.image} alt="" className="h-16 w-16 rounded-2xl object-cover" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-sm text-muted">₹{c.price}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="grid h-8 w-8 place-items-center rounded-full border border-border bg-white"
                    onClick={() => updateQty(c.id, c.quantity - 1)}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-6 text-center font-semibold">{c.quantity}</span>
                  <button
                    type="button"
                    className="grid h-8 w-8 place-items-center rounded-full border border-border bg-white"
                    onClick={() => updateQty(c.id, c.quantity + 1)}
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromCart(c.id)}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-red-500"
                >
                  <Trash2 size={14} />
                  Remove
                </button>
              </GlassCard>
            ))}
          </ul>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong flex items-center justify-between rounded-[24px] p-5"
          >
            <div>
              <div className="text-sm text-muted">Subtotal</div>
              <div className="text-2xl font-extrabold">₹{cartSubtotal.toFixed(0)}</div>
            </div>
            <Link
              to="/checkout"
              className="rounded-full bg-gradient-to-r from-orange to-[#ff7a45] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange/25 transition hover:scale-105"
            >
              Checkout
            </Link>
          </motion.div>
        </>
      )}
    </PageShell>
  )
}
