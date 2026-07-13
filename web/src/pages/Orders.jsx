import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Clock } from 'lucide-react'
import { PERSONAS } from '../data/personas'
import { useStore } from '../store/useStore'
import {
  DEFAULT_ESTIMATED_MINUTES,
  TRACKING_STEPS,
  formatCountdown,
  getRemainingSec,
  getTrackingStageIndex,
  loadOrderTimer,
  saveOrderTimer,
} from '../utils/orderTimer'

const LOUNGE_CHIPS = [
  { key: 'master_chef', chip: 'Marco' },
  { key: 'girlfriend', chip: 'Aria' },
  { key: 'director', chip: 'Sam' },
  { key: 'fitness_coach', chip: 'Rex' },
  { key: 'actress', chip: 'Emma' },
  { key: 'singer', chip: 'Luna' },
  { key: 'ceo', chip: 'Victor' },
  { key: 'footballer', chip: 'Leo' },
]

export default function Orders() {
  const [params] = useSearchParams()
  const placed = params.get('placed')
  const activeOrderId = useStore((s) => s.activeOrderId)
  const orderStartedAt = useStore((s) => s.orderStartedAt)
  const orderDurationSec = useStore((s) => s.orderDurationSec)
  const setOrderStageIndex = useStore((s) => s.setOrderStageIndex)
  const lastOrderItems = useStore((s) => s.lastOrderItems || [])
  const lastOrderTotal = useStore((s) => s.lastOrderTotal || 0)
  const selectedPersona = useStore((s) => s.selectedPersona)
  const setPersona = useStore((s) => s.setPersona)

  const orderId = placed || activeOrderId

  const [tick, setTick] = useState(0)

  const timerMeta = useMemo(() => {
    if (!orderId) return null
    const stored = loadOrderTimer()
    if (stored && stored.orderId === orderId) return stored
    if (orderStartedAt && orderDurationSec) {
      return {
        orderId,
        startedAt: orderStartedAt,
        durationSec: orderDurationSec,
      }
    }
    return null
  }, [orderId, orderStartedAt, orderDurationSec, tick])

  useEffect(() => {
    if (!orderId) return
    const stored = loadOrderTimer()
    if (stored?.orderId === orderId) return
    if (orderStartedAt && orderDurationSec) {
      saveOrderTimer({
        orderId,
        startedAt: orderStartedAt,
        durationSec: orderDurationSec,
      })
      setTick((t) => t + 1)
      return
    }
    // Legacy order without timer metadata — start a fresh 30-min window once
    const startedAt = Date.now()
    const durationSec = DEFAULT_ESTIMATED_MINUTES * 60
    saveOrderTimer({ orderId, startedAt, durationSec })
    setTick((t) => t + 1)
  }, [orderId, orderStartedAt, orderDurationSec])

  const durationSec = timerMeta?.durationSec ?? DEFAULT_ESTIMATED_MINUTES * 60
  const startedAt = timerMeta?.startedAt ?? Date.now()
  const estimatedMinutes = Math.round(durationSec / 60)

  const [now, setNow] = useState(() => Date.now())
  const remainingSec = timerMeta
    ? getRemainingSec(startedAt, durationSec, now)
    : durationSec
  const stageIndex = getTrackingStageIndex(remainingSec, durationSec)
  const progressPct = Math.min(100, ((durationSec - remainingSec) / durationSec) * 100)
  const delivered = remainingSec <= 0

  useEffect(() => {
    if (!orderId || !timerMeta) return undefined
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [orderId, timerMeta])

  useEffect(() => {
    if (!orderId) return
    setOrderStageIndex(stageIndex)
  }, [orderId, stageIndex, setOrderStageIndex])

  const persona =
    PERSONAS.find((p) => p.key === selectedPersona) ||
    PERSONAS.find((p) => p.key === 'master_chef') ||
    PERSONAS[0]

  if (!orderId) {
    return (
      <div className="min-h-[60vh] rounded-[24px] bg-[#FFF9F3] px-4 py-10 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-lg rounded-[24px] border border-[#EAEAEA] bg-white p-8 text-center shadow-[0_12px_40px_rgba(31,31,31,0.06)]"
        >
          <h1 className="font-serif text-3xl font-semibold text-[#1F1F1F]">Order Tracking</h1>
          <p className="mt-3 text-sm text-[#5A5A5A]">
            No active order yet. Place something delicious and track it here.
          </p>
          <Link
            to="/menu"
            className="mt-6 inline-flex rounded-full bg-[#F97316] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange/25 transition hover:scale-105 hover:bg-[#ea580c]"
          >
            Browse Menu
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="-mx-4 -mt-2 min-h-screen bg-[#FFF9F3] px-4 pb-16 pt-2 md:-mx-6 md:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[24px] bg-gradient-to-br from-[#F97316] via-[#fb923c] to-[#ea580c] p-7 text-white shadow-[0_18px_50px_rgba(249,115,22,0.35)] md:p-9"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] backdrop-blur-sm">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-white text-[#F97316]">
              <Check size={13} strokeWidth={3} />
            </span>
            {delivered ? 'Delivered' : 'Order Confirmed'}
          </div>
          <h1 className="mt-4 font-serif text-3xl font-semibold leading-tight md:text-4xl">
            {delivered
              ? `Order #${orderId} has been delivered. Enjoy!`
              : `Thank you! Your order #${orderId} is on the way.`}
          </h1>
          <p className="mt-3 text-sm font-medium text-white/90 md:text-base">
            Estimated preparation time:{' '}
            <span className="font-bold text-white">{estimatedMinutes} minutes</span>
          </p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="rounded-[24px] border border-[#EAEAEA] bg-white p-6 shadow-[0_12px_40px_rgba(31,31,31,0.06)] md:p-8"
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#F97316]">
                Live tracking
              </p>
              <h2 className="mt-1 font-serif text-2xl font-semibold text-[#1F1F1F]">
                {TRACKING_STEPS[stageIndex]}
              </h2>
            </div>

            <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2 rounded-full bg-[#FFF7ED] px-4 py-2 text-sm font-semibold text-[#1F1F1F]">
                <Clock size={16} className="text-[#F97316]" />
                {delivered ? 'Arrived' : 'Time remaining'}
              </div>
              <div
                className={`min-w-[7.5rem] rounded-[16px] px-4 py-2 text-center font-mono text-3xl font-bold tabular-nums tracking-tight ${
                  delivered
                    ? 'bg-[#16a34a]/10 text-[#16a34a]'
                    : 'bg-[#1F1F1F] text-white'
                }`}
                aria-live="polite"
              >
                {formatCountdown(remainingSec)}
              </div>
            </div>
          </div>

          <div className="mt-6 h-2.5 overflow-hidden rounded-full bg-[#F3EDE6]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#F97316] to-[#fb923c] transition-[width] duration-1000 ease-linear"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <ol className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {TRACKING_STEPS.map((label, i) => {
              const complete = delivered || i < stageIndex
              const active = !delivered && i === stageIndex
              return (
                <li key={label} className="flex flex-col items-center text-center">
                  <span
                    className={`grid h-9 w-9 place-items-center rounded-full border-2 transition-all duration-300 ${
                      complete
                        ? 'border-[#F97316] bg-[#F97316] text-white shadow-md shadow-orange/30'
                        : active
                          ? 'border-[#F97316] bg-[#F97316] text-white ring-4 ring-[#F97316]/20'
                          : 'border-[#D1D5DB] bg-white text-transparent'
                    }`}
                  >
                    {(complete || active) && <Check size={16} strokeWidth={3} />}
                  </span>
                  <span
                    className={`mt-2 text-xs font-semibold leading-snug ${
                      complete || active ? 'text-[#1F1F1F]' : 'text-[#9CA3AF]'
                    } ${active ? 'text-[#F97316]' : ''}`}
                  >
                    {label}
                  </span>
                </li>
              )
            })}
          </ol>
        </motion.section>

        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.9fr]">
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-[24px] border border-[#EAEAEA] bg-white p-6 shadow-[0_12px_40px_rgba(31,31,31,0.06)] md:p-8"
          >
            <h2 className="font-serif text-3xl font-semibold text-[#1F1F1F]">AI Waiting Lounge</h2>
            <p className="mt-2 text-sm text-[#5A5A5A]">
              Pick a companion to chat with while your food is prepared.
            </p>

            <div className="mt-5 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {LOUNGE_CHIPS.map(({ key, chip }) => {
                const active = selectedPersona === key
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setPersona(key)}
                    className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition hover:scale-105 ${
                      active
                        ? 'bg-[#F97316] text-white shadow-md shadow-orange/25'
                        : 'border border-[#E5E7EB] bg-[#FFF9F3] text-[#1F1F1F] hover:border-[#F97316]/40'
                    }`}
                  >
                    {chip}
                  </button>
                )
              })}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-[0.95fr_1.15fr]">
              <div className="rounded-[20px] border border-[#EAEAEA] bg-[#FFF9F3] p-5 transition hover:-translate-y-1 hover:shadow-md">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white text-3xl shadow-sm">
                  {persona.emoji}
                </div>
                <h3 className="mt-4 font-serif text-xl font-semibold text-[#1F1F1F]">
                  {persona.displayName} {persona.characterName}
                </h3>
                <p className="mt-1 text-sm text-[#5A5A5A]">{persona.tagline}</p>
                <Link
                  to="/ai-lounge"
                  onClick={() => setPersona(persona.key)}
                  className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-[#F97316] py-2.5 text-sm font-semibold text-white transition hover:scale-[1.02] hover:bg-[#ea580c]"
                >
                  Start chatting
                </Link>
              </div>

              <div className="flex flex-col justify-center rounded-[20px] border border-[#EAEAEA] bg-white p-5 shadow-sm">
                <div className="relative max-w-[95%] rounded-[18px] rounded-tl-md bg-[#FFF7ED] px-4 py-3 text-sm leading-relaxed text-[#1F1F1F]">
                  <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#F97316]">
                    {persona.characterName}
                  </span>
                  {persona.key === 'master_chef'
                    ? 'Ciao! While your food is cooking, want a recipe idea?'
                    : `Hey! I'm ${persona.characterName}. Your order is cooking — want to chat while you wait?`}
                </div>
                <Link
                  to="/ai-lounge"
                  onClick={() => setPersona(persona.key)}
                  className="mt-4 text-sm font-semibold text-[#F97316] transition hover:underline"
                >
                  Open full AI Lounge →
                </Link>
              </div>
            </div>
          </motion.section>

          <motion.aside
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            className="h-fit rounded-[24px] border border-[#EAEAEA] bg-white p-6 shadow-[0_12px_40px_rgba(31,31,31,0.06)] lg:sticky lg:top-24"
          >
            <h2 className="font-serif text-2xl font-semibold text-[#1F1F1F]">Order Details</h2>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">
              #{orderId}
            </p>

            {lastOrderItems.length === 0 ? (
              <p className="mt-5 text-sm text-[#5A5A5A]">
                Order items will appear here after checkout.
              </p>
            ) : (
              <ul className="mt-5 space-y-4">
                {lastOrderItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex gap-3 border-b border-[#F3EDE6] pb-4 last:border-0"
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-16 w-16 rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#FFF7ED] text-xl">
                        🍽
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-semibold text-[#1F1F1F]">{item.name}</div>
                      <div className="mt-1 flex justify-between text-sm text-[#5A5A5A]">
                        <span>Qty {item.quantity}</span>
                        <span>₹{item.price}</span>
                      </div>
                      <div className="mt-1 text-right text-sm font-bold text-[#1F1F1F]">
                        Subtotal ₹{(item.price * item.quantity).toFixed(0)}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-5 flex items-center justify-between border-t border-[#F3EDE6] pt-4">
              <span className="text-sm font-semibold text-[#5A5A5A]">Total</span>
              <span className="font-serif text-2xl font-semibold text-[#1F1F1F]">
                ₹{Number(lastOrderTotal || 0).toFixed(0)}
              </span>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  )
}
