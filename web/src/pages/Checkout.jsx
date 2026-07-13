import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'

export default function Checkout() {
  const navigate = useNavigate()
  const customer = useStore((s) => s.customer)
  const setCustomer = useStore((s) => s.setCustomer)
  const cart = useStore((s) => s.cart)
  const cartSubtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const placeOrder = useStore((s) => s.placeOrder)
  const [form, setForm] = useState(customer)

  const submit = (e) => {
    e.preventDefault()
    setCustomer(form)
    const id = placeOrder()
    navigate(`/orders?placed=${id}`)
  }

  if (cart.length === 0) {
    return (
      <div className="rounded-3xl border border-border bg-white p-8 text-center">
        <p>Cart is empty.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-2">
      <form onSubmit={submit} className="space-y-4 rounded-3xl border border-border bg-white p-6 shadow-sm">
        <h1 className="font-serif text-3xl font-semibold">Checkout</h1>
        {['name', 'phone', 'email', 'address'].map((field) => (
          <label key={field} className="block text-sm font-semibold capitalize">
            {field}
            <input
              required={field === 'name' || field === 'address'}
              value={form[field] || ''}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              className="mt-1 h-11 w-full rounded-xl border border-border px-3 text-sm outline-none focus:border-orange/40 focus:ring-4 focus:ring-orange/10"
            />
          </label>
        ))}
        <button
          type="submit"
          className="w-full rounded-full bg-orange py-3 text-sm font-bold text-white shadow-lg shadow-orange/25"
        >
          Place Order
        </button>
      </form>

      <div className="h-fit rounded-3xl border border-border bg-white p-6 shadow-sm">
        <h2 className="font-serif text-xl font-semibold">Order Summary</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {cart.map((c) => (
            <li key={c.id} className="flex justify-between">
              <span>
                {c.name} × {c.quantity}
              </span>
              <span>₹{(c.price * c.quantity).toFixed(0)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-border pt-3 font-bold">
          <span>Total</span>
          <span>₹{cartSubtotal.toFixed(0)}</span>
        </div>
      </div>
    </div>
  )
}
