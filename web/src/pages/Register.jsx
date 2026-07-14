import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { api } from '../api/client'
import { useStore } from '../store/useStore'

export default function Register() {
  const navigate = useNavigate()
  const setAuth = useStore((s) => s.setAuth)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
    phone: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await api.register(form)
      setAuth({ token: data.access_token, user: data.user })
      navigate(data.user.role === 'chef' ? '/chef' : '/home', { replace: true })
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cream px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,166,0,0.08),_transparent_55%)]" />
      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={onSubmit}
        className="glass-strong relative w-full max-w-md space-y-4 rounded-[28px] p-8"
      >
        <div className="text-center">
          <h1 className="font-serif text-3xl font-semibold">Join FoodVerse</h1>
          <p className="mt-1 text-sm text-muted">Create a customer or chef account</p>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {['name', 'email', 'phone', 'password'].map((field) => (
          <label key={field} className="block text-sm font-semibold capitalize">
            {field}
            <input
              name={field}
              type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
              required={field !== 'phone'}
              minLength={field === 'password' ? 6 : undefined}
              value={form[field]}
              onChange={onChange}
              className="mt-1 h-11 w-full rounded-xl border border-border px-3 text-sm outline-none focus:border-orange/40 focus:ring-4 focus:ring-orange/10"
            />
          </label>
        ))}

        <fieldset>
          <legend className="text-sm font-semibold">I am a</legend>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {[
              ['customer', 'Customer'],
              ['chef', 'Chef'],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setForm({ ...form, role: value })}
                className={`rounded-2xl border px-3 py-3 text-sm font-semibold transition ${
                  form.role === value
                    ? 'border-orange bg-orange/10 text-orange'
                    : 'border-border text-ink hover:bg-cream-deep'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={loading}
          className="h-11 w-full rounded-full bg-orange text-sm font-bold text-white transition hover:bg-orange-hover disabled:opacity-60"
        >
          {loading ? 'Creating…' : 'Create account'}
        </button>

        <p className="text-center text-sm text-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-orange hover:underline">
            Sign in
          </Link>
        </p>
      </motion.form>
    </div>
  )
}
