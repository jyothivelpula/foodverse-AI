import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'

export default function ChefProfile() {
  const navigate = useNavigate()
  const user = useStore((s) => s.user)
  const logout = useStore((s) => s.logout)
  const [name] = useState(user?.name || '')
  const [email] = useState(user?.email || '')

  const onLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="mx-auto max-w-xl space-y-4 py-6">
      <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
        <h1 className="font-serif text-4xl font-semibold">Chef Profile</h1>
        <p className="mt-1 text-sm text-muted">Account details from your JWT session</p>

        <div className="mt-6 space-y-4">
          <label className="block text-sm font-semibold">
            Name
            <input
              value={name}
              readOnly
              className="mt-1 h-11 w-full rounded-xl border border-border bg-cream-deep px-3 text-sm text-muted"
            />
          </label>
          <label className="block text-sm font-semibold">
            Email
            <input
              value={email}
              readOnly
              className="mt-1 h-11 w-full rounded-xl border border-border bg-cream-deep px-3 text-sm text-muted"
            />
          </label>
          <label className="block text-sm font-semibold">
            Role
            <input
              value="Chef"
              readOnly
              className="mt-1 h-11 w-full rounded-xl border border-border bg-cream-deep px-3 text-sm text-muted"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="mt-6 rounded-full border border-red-200 bg-red-50 px-6 py-2.5 text-sm font-bold text-red-600"
        >
          Sign out
        </button>
      </div>
    </div>
  )
}
