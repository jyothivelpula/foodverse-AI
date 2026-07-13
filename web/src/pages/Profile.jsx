import { useState } from 'react'
import { useStore } from '../store/useStore'

export default function Profile() {
  const customer = useStore((s) => s.customer)
  const setCustomer = useStore((s) => s.setCustomer)
  const [form, setForm] = useState(customer)
  const [saved, setSaved] = useState(false)

  const save = (e) => {
    e.preventDefault()
    setCustomer(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <form
      onSubmit={save}
      className="mx-auto max-w-xl space-y-4 rounded-3xl border border-border bg-white p-6 shadow-sm"
    >
      <h1 className="font-serif text-4xl font-semibold">Profile</h1>
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
      <button
        type="submit"
        className="rounded-full bg-orange px-6 py-2.5 text-sm font-bold text-white"
      >
        Save profile
      </button>
      {saved && <span className="ml-3 text-sm text-green-600">Saved!</span>}
    </form>
  )
}
