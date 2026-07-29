import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { api } from '../api/client'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const RESET_EMAIL_KEY = 'foodverse_reset_email'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [fieldError, setFieldError] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const value = email.trim()
    if (!value) {
      setFieldError('Email is required.')
      return false
    }
    if (!EMAIL_RE.test(value)) {
      setFieldError('Please enter a valid email address.')
      return false
    }
    setFieldError('')
    return true
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!validate()) return
    setLoading(true)
    try {
      const trimmed = email.trim().toLowerCase()
      const data = await api.forgotPassword({ email: trimmed })
      sessionStorage.setItem(RESET_EMAIL_KEY, trimmed)
      navigate('/verify-otp', {
        state: {
          email: trimmed,
          expiresIn: data.expires_in || 300,
          delivery: data.delivery || 'smtp',
          message: data.message,
          devOtp: data.dev_otp || null,
        },
      })
    } catch (err) {
      setError(err.message || 'Could not send OTP. Please try again.')
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
        noValidate
      >
        <div className="text-center">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-orange text-xl text-white">
            🔑
          </div>
          <h1 className="font-serif text-3xl font-semibold text-ink">Forgot Password</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Enter your registered email and we&apos;ll send a 6-digit verification code.
          </p>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <label className="block text-sm font-semibold">
          Email Address
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (fieldError) setFieldError('')
            }}
            className="mt-1 h-11 w-full rounded-xl border border-border px-3 text-sm outline-none focus:border-orange/40 focus:ring-4 focus:ring-orange/10"
            placeholder="you@example.com"
          />
          {fieldError && (
            <span className="mt-1 block text-xs font-medium text-red-600">{fieldError}</span>
          )}
        </label>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-orange text-sm font-bold text-white transition hover:bg-orange-hover disabled:opacity-60"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? 'Sending OTP…' : 'Send OTP'}
        </button>

        <Link
          to="/login"
          className="inline-flex w-full items-center justify-center gap-1.5 text-sm font-semibold text-muted transition hover:text-orange"
        >
          <ArrowLeft size={14} />
          Back to Login
        </Link>
      </motion.form>
    </div>
  )
}
