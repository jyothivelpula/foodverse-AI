import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { api } from '../api/client'

const RESET_TOKEN_KEY = 'foodverse_reset_token'
const RESET_EMAIL_KEY = 'foodverse_reset_email'

function passwordStrength(pw) {
  if (!pw) return { score: 0, label: '' }
  let score = 0
  if (pw.length >= 6) score += 1
  if (pw.length >= 10) score += 1
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score += 1
  if (/\d/.test(pw)) score += 1
  if (/[^A-Za-z0-9]/.test(pw)) score += 1
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Strong']
  return { score, label: labels[score] }
}

export default function ResetPassword() {
  const location = useLocation()
  const navigate = useNavigate()
  const token =
    location.state?.token || sessionStorage.getItem(RESET_TOKEN_KEY) || ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const strength = useMemo(() => passwordStrength(password), [password])

  useEffect(() => {
    if (!token && !done) {
      navigate('/forgot-password', { replace: true })
    }
  }, [token, done, navigate])

  useEffect(() => {
    if (!done) return undefined
    const id = window.setTimeout(() => {
      navigate('/login', {
        replace: true,
        state: { successMessage: 'Password updated successfully. Please sign in.' },
      })
    }, 2200)
    return () => clearTimeout(id)
  }, [done, navigate])

  const validate = () => {
    const next = {}
    if (!token) next.token = 'Reset session expired. Please start again.'
    if (!password) next.password = 'New password is required.'
    else if (password.length < 6) next.password = 'Password must be at least 6 characters.'
    else if (strength.score < 2) next.password = 'Please choose a stronger password.'
    if (!confirm) next.confirm = 'Please confirm your password.'
    else if (password !== confirm) next.confirm = 'Passwords must match.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!validate()) return
    setLoading(true)
    try {
      await api.resetPassword({ token, newPassword: password })
      sessionStorage.removeItem(RESET_TOKEN_KEY)
      sessionStorage.removeItem(RESET_EMAIL_KEY)
      setDone(true)
    } catch (err) {
      setError(err.message || 'Could not reset password. Please request a new OTP.')
    } finally {
      setLoading(false)
    }
  }

  if (!token && !done) return null

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cream px-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(92,164,123,0.14),_transparent_55%)]" />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong relative w-full max-w-md rounded-[28px] p-8"
      >
        {done ? (
          <div className="space-y-4 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#5CA47B]/15 text-xl">
              ✅
            </div>
            <h1 className="font-serif text-3xl font-semibold text-ink">Password updated</h1>
            <p className="text-sm text-muted">
              Your password has been updated successfully.
              <br />
              Redirecting you to Login…
            </p>
            <Link
              to="/login"
              state={{ successMessage: 'Password updated successfully. Please sign in.' }}
              className="inline-flex h-11 w-full items-center justify-center rounded-full bg-orange text-sm font-bold text-white"
            >
              Go to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-5" noValidate>
            <div className="text-center">
              <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-[#5CA47B] text-xl text-white">
                🔒
              </div>
              <h1 className="font-serif text-3xl font-semibold text-ink">Reset Password</h1>
              <p className="mt-2 text-sm text-muted">Choose a new password for your account.</p>
            </div>

            {(error || errors.token) && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error || errors.token}
              </div>
            )}

            <label className="block text-sm font-semibold">
              New Password
              <div className="relative mt-1">
                <input
                  type={showPw ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 w-full rounded-xl border border-border px-3 pr-11 text-sm outline-none focus:border-orange/40 focus:ring-4 focus:ring-orange/10"
                  placeholder="At least 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {password && (
                <div className="mt-2">
                  <div className="h-1.5 overflow-hidden rounded-full bg-cream-deep">
                    <div
                      className={`h-full rounded-full transition-all ${
                        strength.score <= 2
                          ? 'bg-red-400'
                          : strength.score === 3
                            ? 'bg-amber-400'
                            : 'bg-[#5CA47B]'
                      }`}
                      style={{ width: `${(strength.score / 5) * 100}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[11px] font-medium text-muted">{strength.label}</p>
                </div>
              )}
              {errors.password && (
                <span className="mt-1 block text-xs font-medium text-red-600">
                  {errors.password}
                </span>
              )}
            </label>

            <label className="block text-sm font-semibold">
              Confirm Password
              <div className="relative mt-1">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="h-11 w-full rounded-xl border border-border px-3 pr-11 text-sm outline-none focus:border-orange/40 focus:ring-4 focus:ring-orange/10"
                  placeholder="Repeat password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirm && (
                <span className="mt-1 block text-xs font-medium text-red-600">
                  {errors.confirm}
                </span>
              )}
            </label>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-orange text-sm font-bold text-white transition hover:bg-orange-hover disabled:opacity-60"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Updating…' : 'Reset Password'}
            </button>

            <p className="text-center text-sm text-muted">
              <Link to="/login" className="font-semibold text-orange hover:underline">
                Back to Login
              </Link>
            </p>
          </form>
        )}
      </motion.div>
    </div>
  )
}
