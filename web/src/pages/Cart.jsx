import { Link } from 'react-router-dom'
import { useStore } from '../store/useStore'

export default function Cart() {
  const cart = useStore((s) => s.cart)
  const updateQty = useStore((s) => s.updateQty)
  const removeFromCart = useStore((s) => s.removeFromCart)
  const cartSubtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="font-serif text-4xl font-semibold">Your Cart</h1>
      {cart.length === 0 ? (
        <div className="rounded-3xl border border-border bg-white p-8 text-center shadow-sm">
          <p className="text-muted">Your cart is empty.</p>
          <Link to="/menu" className="mt-4 inline-flex rounded-full bg-orange px-5 py-2.5 text-sm font-bold text-white">
            Browse Menu
          </Link>
        </div>
      ) : (
        <>
          <ul className="space-y-3">
            {cart.map((c) => (
              <li
                key={c.id}
                className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-white p-4 shadow-sm"
              >
                {c.image && (
                  <img src={c.image} alt="" className="h-16 w-16 rounded-xl object-cover" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-sm text-muted">₹{c.price}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="h-8 w-8 rounded-full border"
                    onClick={() => updateQty(c.id, c.quantity - 1)}
                  >
                    −
                  </button>
                  <span className="w-6 text-center font-semibold">{c.quantity}</span>
                  <button
                    type="button"
                    className="h-8 w-8 rounded-full border"
                    onClick={() => updateQty(c.id, c.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromCart(c.id)}
                  className="text-sm font-semibold text-red-500"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between rounded-2xl border border-border bg-white p-5 shadow-sm">
            <div>
              <div className="text-sm text-muted">Subtotal</div>
              <div className="text-2xl font-extrabold">₹{cartSubtotal.toFixed(0)}</div>
            </div>
            <Link
              to="/checkout"
              className="rounded-full bg-orange px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange/25"
            >
              Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
