import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Clock, Radio, XCircle } from 'lucide-react'
import { PERSONAS } from '../data/personas'
import { useStore } from '../store/useStore'
import { useOrderTracking } from '../hooks/useOrderRealtime'
import {
  ORDER_FLOW,
  progressPercent,
  statusIndex,
  statusLabel,
} from '../utils/orderStatus'
import { formatCountdown, getRemainingSec } from '../utils/orderTimer'
import { useEffect, useState } from 'react'

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
  const liveOrder = useStore((s) => s.liveOrder)
  const customerOrderStatus = useStore((s) => s.customerOrderStatus)
  const connectionMode = useStore((s) => s.connectionMode)
  const lastOrderItems = useStore((s) => s.lastOrderItems || [])
  const lastOrderTotal = useStore((s) => s.lastOrderTotal || 0)
  const orderStartedAt = useStore((s) => s.orderStartedAt)
  const orderDurationSec = useStore((s) => s.orderDurationSec)
  const selectedPersona = useStore((s) => s.selectedPersona)
  const setPersona = useStore((s) => s.setPersona)

  const orderId = placed || activeOrderId
  useOrderTracking(orderId)

  const status = liveOrder?.status || customerOrderStatus || 'pending'
  const isRejected = status === 'rejected'
  const isAcceptedOrBeyond = status !== 'pending' && status !== 'rejected'
  const delivered = status === 'delivered'
  const currentIndex = statusIndex(status)
  const pct = liveOrder?.progressPercent ?? progressPercent(status)
  const estimatedMinutes = liveOrder?.estimatedMinutes || Math.round((orderDurationSec || 1800) / 60)

  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!orderId || isRejected || delivered) return undefined
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [orderId, isRejected, delivered])

  const remainingSec =
    orderStartedAt && orderDurationSec
      ? getRemainingSec(orderStartedAt, orderDurationSec, now)
      : estimatedMinutes * 60

  const persona =
    PERSONAS.find((p) => p.key === selectedPersona) ||
    PERSONAS.find((p) => p.key === 'master_chef') ||
    PERSONAS[0]

  const items = liveOrder?.items?.length ? liveOrder.items : lastOrderItems
  const total = liveOrder?.total ?? lastOrderTotal

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
            No active order yet. Place something delicious and track it live here.
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
        {/* Hero / confirmation */}
        {isRejected ? (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[24px] bg-gradient-to-br from-red-600 via-red-500 to-rose-500 p-7 text-white shadow-lg md:p-9"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em]">
              <XCircle size={14} />
              Rejected
            </div>
            <h1 className="mt-4 font-serif text-3xl font-semibold md:text-4xl">
              Your order has been rejected.
            </h1>
            <Link
              to="/menu"
              className="mt-6 inline-flex rounded-full bg-white px-6 py-3 text-sm font-bold text-red-600"
            >
              Order again
            </Link>
          </motion.section>
        ) : (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[24px] bg-gradient-to-br from-[#F97316] via-[#fb923c] to-[#ea580c] p-7 text-white shadow-[0_18px_50px_rgba(249,115,22,0.35)] md:p-9"
          >
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em]">
                <Check size={13} strokeWidth={3} />
                {statusLabel(status)}
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide">
                <Radio
                  size={10}
                  className={connectionMode === 'live' ? 'text-green-300' : 'text-amber-200'}
                />
                {connectionMode === 'live'
                  ? 'Live'
                  : connectionMode === 'polling'
                    ? 'Updating…'
                    : 'Connecting…'}
              </span>
            </div>
            <h1 className="mt-4 font-serif text-3xl font-semibold leading-tight md:text-4xl">
              {status === 'pending'
                ? `Order #${orderId} is waiting for the kitchen.`
                : status === 'accepted'
                  ? '👨‍🍳 Chef accepted your order.'
                  : status === 'cooking'
                    ? '🔥 Your food is now Cooking'
                    : delivered
                      ? `🎉 Done — Order #${orderId} is complete. Enjoy!`
                      : liveOrder?.message || `Order #${orderId} — ${statusLabel(status)}`}
            </h1>
            <p className="mt-3 text-sm font-medium text-white/90 md:text-base">
              Estimated time:{' '}
              <span className="font-bold text-white">{estimatedMinutes} minutes</span>
              {' · '}
              Current status:{' '}
              <span className="font-bold text-white">{statusLabel(status)}</span>
            </p>
          </motion.section>
        )}

        {/* Progress panel */}
        {!isRejected && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-[24px] border border-[#EAEAEA] bg-white p-6 shadow-[0_12px_40px_rgba(31,31,31,0.06)] md:p-8"
          >
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#F97316]">
                  Live tracking
                </p>
                <h2 className="mt-1 font-serif text-2xl font-semibold text-[#1F1F1F]">
                  {statusLabel(status)}
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-2xl bg-[#FFF7ED] px-4 py-2 text-center">
                  <div className="text-[10px] font-bold uppercase tracking-wide text-[#F97316]">
                    Completed
                  </div>
                  <div className="font-mono text-2xl font-bold text-[#1F1F1F]">{pct}%</div>
                </div>
                <div className="rounded-2xl bg-[#1F1F1F] px-4 py-2 text-center text-white">
                  <div className="flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wide text-white/60">
                    <Clock size={12} />
                    ETA left
                  </div>
                  <div className="font-mono text-2xl font-bold tabular-nums" aria-live="polite">
                    {delivered ? '00:00' : formatCountdown(remainingSec)}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-2 flex justify-between text-xs font-semibold text-[#5A5A5A]">
                <span>Progress</span>
                <span>{pct}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-[#F3EDE6]">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#F97316] to-[#fb923c]"
                  initial={false}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.45 }}
                />
              </div>
            </div>

            <ol className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {ORDER_FLOW.map((step, i) => {
                const complete = delivered || i < currentIndex
                const active = !delivered && i === currentIndex
                return (
                  <li key={step} className="flex flex-col items-center text-center">
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
                      className={`mt-2 text-[11px] font-semibold leading-snug ${
                        complete || active ? 'text-[#1F1F1F]' : 'text-[#9CA3AF]'
                      } ${active ? '!text-[#F97316]' : ''}`}
                    >
                      {statusLabel(step)}
                    </span>
                  </li>
                )
              })}
            </ol>

            {isAcceptedOrBeyond && status === 'accepted' && (
              <p className="mt-6 rounded-2xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                👨‍🍳 Chef accepted your order.
              </p>
            )}
            {status === 'cooking' && (
              <p className="mt-6 rounded-2xl bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-700">
                🔔 Chef Update — 🔥 Your food is now Cooking
              </p>
            )}
            {delivered && (
              <p className="mt-6 rounded-2xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                🎉 Done
              </p>
            )}
          </motion.section>
        )}

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
              <div className="rounded-[20px] border border-[#EAEAEA] bg-[#FFF9F3] p-5">
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
                  className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-[#F97316] py-2.5 text-sm font-semibold text-white"
                >
                  Start chatting
                </Link>
              </div>
              <div className="flex flex-col justify-center rounded-[20px] border border-[#EAEAEA] bg-white p-5 shadow-sm">
                <div className="relative max-w-[95%] rounded-[18px] rounded-tl-md bg-[#FFF7ED] px-4 py-3 text-sm leading-relaxed text-[#1F1F1F]">
                  <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#F97316]">
                    {persona.characterName}
                  </span>
                  Your order status is live — I&apos;ll keep you company while you wait.
                </div>
                <Link
                  to="/ai-lounge"
                  className="mt-4 text-sm font-semibold text-[#F97316] hover:underline"
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
            {items.length === 0 ? (
              <p className="mt-5 text-sm text-[#5A5A5A]">Order items will appear here after checkout.</p>
            ) : (
              <ul className="mt-5 space-y-4">
                {items.map((item) => (
                  <li
                    key={`${item.id}-${item.name}`}
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
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-5 flex items-center justify-between border-t border-[#F3EDE6] pt-4">
              <span className="text-sm font-semibold text-[#5A5A5A]">Total</span>
              <span className="font-serif text-2xl font-semibold text-[#1F1F1F]">
                ₹{Number(total || 0).toFixed(0)}
              </span>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  )
}
