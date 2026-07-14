import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'

export default function Profile() {
  const navigate = useNavigate()
  const customer = useStore((s) => s.customer)
  const user = useStore((s) => s.user)
  const setCustomer = useStore((s) => s.setCustomer)
  const logout = useStore((s) => s.logout)
  const [form, setForm] = useState({
    ...customer,
    name: customer.name || user?.name || '',
    email: customer.email || user?.email || '',
  })
  const [saved, setSaved] = useState(false)

  const save = (e) => {
    e.preventDefault()
    setCustomer(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const onLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <form
      onSubmit={save}
      className="mx-auto max-w-xl space-y-4 rounded-3xl border border-border bg-white p-6 shadow-sm"
    >
      <div>
        <h1 className="font-serif text-4xl font-semibold">Profile</h1>
        <p className="mt-1 text-sm text-muted">Signed in as {user?.role || 'customer'}</p>
      </div>
      {['name', 'phone', 'email', 'address'].map((field) => (
        <label key={field} className="block text-sm font-semibold capitalize">
          {field}
          <input
            value={form[field] || ''}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            className="mt-1 h-11 w-full rounded-xl border border-border px-3 text-sm outline-none focus:border-orange/40 focus:ring-4 focus:ring-orange/10"
          />
        </label>
      ))}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          className="rounded-full bg-orange px-6 py-2.5 text-sm font-bold text-white"
        >
          Save profile
        </button>
        <button
          type="button"
          onClick={onLogout}
          className="rounded-full border border-red-200 bg-red-50 px-6 py-2.5 text-sm font-bold text-red-600"
        >
          Sign out
        </button>
        {saved && <span className="text-sm text-green-600">Saved!</span>}
      </div>
    </form>
  )
}
