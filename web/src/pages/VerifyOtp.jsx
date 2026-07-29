import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { api } from '../api/client'
import OtpInput from '../components/auth/OtpInput'

const RESET_EMAIL_KEY = 'foodverse_reset_email'
const RESET_TOKEN_KEY = 'foodverse_reset_token'
const OTP_TTL_SECONDS = 5 * 60

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function VerifyOtp() {
  const navigate = useNavigate()
  const location = useLocation()
  const email =
    location.state?.email || sessionStorage.getItem(RESET_EMAIL_KEY) || ''

  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState(location.state?.message || '')
  const [delivery, setDelivery] = useState(location.state?.delivery || 'smtp')
  const [devOtp, setDevOtp] = useState(location.state?.devOtp || '')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(
    location.state?.expiresIn || OTP_TTL_SECONDS
  )

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password', { replace: true })
    }
  }, [email, navigate])

  useEffect(() => {
    if (secondsLeft <= 0) return undefined
    const id = window.setTimeout(() => {
      setSecondsLeft((s) => Math.max(0, s - 1))
    }, 1000)
    return () => clearTimeout(id)
  }, [secondsLeft])

  const restartTimer = useCallback((expiresIn = OTP_TTL_SECONDS) => {
    setSecondsLeft(expiresIn)
  }, [])

  const onVerify = async (e) => {
    e.preventDefault()
    setError('')
    setInfo('')
    if (otp.length !== 6) {
      setError('Please enter the 6-digit code.')
      return
    }
    if (secondsLeft <= 0) {
      setError('OTP has expired. Please resend a new code.')
      return
    }
    setLoading(true)
    try {
      const data = await api.verifyOtp({ email, otp })
      sessionStorage.setItem(RESET_TOKEN_KEY, data.reset_token)
      sessionStorage.setItem(RESET_EMAIL_KEY, email)
      navigate('/reset-password', { replace: true, state: { token: data.reset_token } })
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.')
      setOtp('')
    } finally {
      setLoading(false)
    }
  }

  const onResend = async () => {
    setError('')
    setInfo('')
    setResending(true)
    try {
      const data = await api.resendOtp({ email })
      setOtp('')
      restartTimer(data.expires_in || OTP_TTL_SECONDS)
      if (data.delivery) setDelivery(data.delivery)
      setDevOtp(data.dev_otp || '')
      setInfo(data.message || 'A new OTP has been sent to your email.')
    } catch (err) {
      setError(err.message || 'Could not resend OTP.')
    } finally {
      setResending(false)
    }
  }

  if (!email) return null

  const expired = secondsLeft <= 0

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cream px-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,90,31,0.12),_transparent_55%)]" />
      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={onVerify}
        className="glass-strong relative w-full max-w-md space-y-5 rounded-[28px] p-8"
        noValidate
      >
        <div className="text-center">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-orange text-xl text-white">
            ✉
          </div>
          <h1 className="font-serif text-3xl font-semibold text-ink">Verify OTP</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Enter the 6-digit code sent to{' '}
            <span className="font-semibold text-ink">{email}</span>
          </p>
        </div>

        {delivery === 'console' && (
          <div className="space-y-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <p>
              Email is not configured, so the code is shown here for testing.
            </p>
            {devOtp && (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-mono text-2xl font-bold tracking-[0.35em] text-ink">
                  {devOtp}
                </p>
                <button
                  type="button"
                  onClick={() => setOtp(devOtp)}
                  className="rounded-full bg-orange px-4 py-2 text-xs font-bold text-white hover:bg-orange-hover"
                >
                  Fill code
                </button>
              </div>
            )}
            <p className="text-xs text-amber-800/80">
              To send real emails later, add a Gmail App Password to{" "}
              <code>SMTP_PASSWORD</code> in <code>backend/.env</code>.
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {info && delivery !== 'console' && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {info}
          </div>
        )}

        <OtpInput value={otp} onChange={setOtp} disabled={loading} />

        <div className="text-center text-sm text-muted">
          {expired ? (
            <span className="font-medium text-red-600">Code expired</span>
          ) : (
            <>
              Code expires in{' '}
              <span className="font-semibold text-ink">{formatTime(secondsLeft)}</span>
            </>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || otp.length !== 6 || expired}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-orange text-sm font-bold text-white transition hover:bg-orange-hover disabled:opacity-60"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? 'Verifying…' : 'Verify OTP'}
        </button>

        <button
          type="button"
          onClick={onResend}
          disabled={!expired || resending}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-border bg-white text-sm font-semibold text-ink transition hover:bg-cream-deep disabled:cursor-not-allowed disabled:opacity-50"
        >
          {resending && <Loader2 size={16} className="animate-spin" />}
          {resending ? 'Sending…' : 'Resend OTP'}
        </button>

        <Link
          to="/forgot-password"
          className="inline-flex w-full items-center justify-center gap-1.5 text-sm font-semibold text-muted transition hover:text-orange"
        >
          <ArrowLeft size={14} />
          Change email
        </Link>
      </motion.form>
    </div>
  )
}
