import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { api } from '../api/client'
import { useStore } from '../store/useStore'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const setAuth = useStore((s) => s.setAuth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await api.login({ email, password })
      setAuth({ token: data.access_token, user: data.user })
      const dest =
        location.state?.from?.pathname ||
        (data.user.role === 'chef' ? '/chef' : '/home')
      // Never send chef into customer pages via "from"
      if (data.user.role === 'chef' && !String(dest).startsWith('/chef')) {
        navigate('/chef', { replace: true })
      } else if (data.user.role === 'customer' && String(dest).startsWith('/chef')) {
        navigate('/home', { replace: true })
      } else {
        navigate(dest, { replace: true })
      }
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cream px-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,90,31,0.12),_transparent_55%)]" />
      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={onSubmit}
        className="glass-strong relative w-full max-w-md space-y-5 rounded-[28px] p-8"
      >
        <div className="text-center">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-orange text-xl text-white">
            🍽
          </div>
          <h1 className="font-serif text-3xl font-semibold text-ink">Welcome back</h1>
          <p className="mt-1 text-sm text-muted">Sign in to FoodVerse</p>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <label className="block text-sm font-semibold">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 h-11 w-full rounded-xl border border-border px-3 text-sm outline-none focus:border-orange/40 focus:ring-4 focus:ring-orange/10"
            placeholder="you@example.com"
          />
        </label>

        <label className="block text-sm font-semibold">
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 h-11 w-full rounded-xl border border-border px-3 text-sm outline-none focus:border-orange/40 focus:ring-4 focus:ring-orange/10"
            placeholder="••••••••"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="h-11 w-full rounded-full bg-orange text-sm font-bold text-white transition hover:bg-orange-hover disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>

        <p className="text-center text-sm text-muted">
          New here?{' '}
          <Link to="/register" className="font-semibold text-orange hover:underline">
            Create account
          </Link>
        </p>
      </motion.form>
    </div>
  )
}
