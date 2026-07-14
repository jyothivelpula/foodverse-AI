import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Clock3, Radio, Sparkles, ChefHat } from 'lucide-react'
import { PERSONAS } from '../data/personas'
import { useStore } from '../store/useStore'
import { api } from '../api/client'
import { useOrderTracking } from '../hooks/useOrderRealtime'
import {
  progressPercent,
  statusLabel,
} from '../utils/orderStatus'
import { formatCountdown, getRemainingSec } from '../utils/orderTimer'

export default function AiLounge() {
  const selectedPersona = useStore((s) => s.selectedPersona)
  const setPersona = useStore((s) => s.setPersona)
  const getChat = useStore((s) => s.getChat)
  const appendChat = useStore((s) => s.appendChat)
  const backendOnline = useStore((s) => s.backendOnline)
  const setBackendOnline = useStore((s) => s.setBackendOnline)
  const activeOrderId = useStore((s) => s.activeOrderId)
  const liveOrder = useStore((s) => s.liveOrder)
  const customerOrderStatus = useStore((s) => s.customerOrderStatus)
  const notifications = useStore((s) => s.notifications)
  const connectionMode = useStore((s) => s.connectionMode)
  const orderStartedAt = useStore((s) => s.orderStartedAt)
  const orderDurationSec = useStore((s) => s.orderDurationSec)
  const kitchenChefName = useStore((s) => s.kitchenChefName)

  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [now, setNow] = useState(() => Date.now())
  const bottomRef = useRef(null)
  const chatPaneRef = useRef(null)

  const persona = PERSONAS.find((p) => p.key === selectedPersona) || PERSONAS[0]
  const messages = getChat(persona.key)

  useOrderTracking(activeOrderId)

  const status = liveOrder?.status || customerOrderStatus || null
  const pct = liveOrder?.progressPercent ?? (status ? progressPercent(status) : 0)
  const estimatedMinutes =
    liveOrder?.estimatedMinutes || Math.round((orderDurationSec || 1800) / 60)
  const orderId = liveOrder?.id || activeOrderId

  const orderNotifs = useMemo(() => {
    if (!orderId) return notifications.slice(0, 8)
    return notifications.filter((n) => n.orderId === orderId).slice(0, 12)
  }, [notifications, orderId])

  useEffect(() => {
    if (!orderId || status === 'delivered' || status === 'rejected') return undefined
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [orderId, status])

  const remainingSec =
    orderStartedAt && orderDurationSec
      ? getRemainingSec(orderStartedAt, orderDurationSec, now)
      : estimatedMinutes * 60

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, busy])

  const send = async (e) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || busy) return
    setInput('')
    setError('')
    appendChat('user', text, persona.key)
    setBusy(true)
    try {
      const history = getChat(persona.key).map((m) => ({
        role: m.role,
        content: m.content,
      }))
      const data = await api.sendChat({
        personaKey: persona.key,
        message: text,
        history: history.slice(0, -1),
      })
      appendChat('assistant', data.reply, persona.key)
      setBackendOnline(true)
    } catch (err) {
      setBackendOnline(false)
      const msg =
        err?.message ||
        'Could not reach chat. Start the backend with uvicorn and set GROQ_API_KEY.'
      setError(msg)
      appendChat('assistant', `⚠️ ${msg}`, persona.key)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5 py-2">
      {/* ── Top: order status ── */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-[28px] border border-border bg-gradient-to-br from-ink via-[#1f1f1f] to-[#3a2118] p-6 text-white shadow-xl md:p-8"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white/80">
              <Sparkles size={12} className="text-orange" />
              AI Waiting Lounge
            </div>
            <h1 className="mt-3 font-serif text-3xl font-semibold md:text-4xl">
              {orderId ? `Order #${orderId}` : 'No active order'}
            </h1>
            <p className="mt-2 text-sm text-white/70">
              {orderId
                ? 'Relax and chat — kitchen updates appear live above your conversation.'
                : 'Place an order to unlock live kitchen status in the lounge.'}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide">
              <Radio
                size={10}
                className={connectionMode === 'live' ? 'text-green-400' : 'text-amber-300'}
              />
              {connectionMode === 'live'
                ? 'Live'
                : connectionMode === 'polling'
                  ? 'Updating'
                  : orderId
                    ? 'Connecting…'
                    : 'Idle'}
            </span>
            {!orderId && (
              <Link
                to="/menu"
                className="rounded-full bg-orange px-4 py-2 text-xs font-bold text-white"
              >
                Browse menu
              </Link>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white/8 px-4 py-3 backdrop-blur-sm">
            <div className="text-[10px] font-bold uppercase tracking-wide text-white/50">
              Current status
            </div>
            <div className="mt-1 text-lg font-semibold">
              {status ? statusLabel(status) : '—'}
            </div>
          </div>
          <div className="rounded-2xl bg-white/8 px-4 py-3 backdrop-blur-sm">
            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-white/50">
              <Clock3 size={11} />
              Estimated time
            </div>
            <div className="mt-1 font-mono text-lg font-semibold tabular-nums">
              {orderId && status !== 'delivered' && status !== 'rejected'
                ? formatCountdown(remainingSec)
                : orderId
                  ? '00:00'
                  : `${estimatedMinutes} min`}
            </div>
          </div>
          <div className="rounded-2xl bg-white/8 px-4 py-3 backdrop-blur-sm">
            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-white/50">
              <ChefHat size={11} />
              Chef
            </div>
            <div className="mt-1 text-lg font-semibold">{kitchenChefName}</div>
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex justify-between text-xs font-semibold text-white/60">
            <span>Progress</span>
            <span>{orderId ? `${pct}%` : '0%'}</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-orange to-[#ffb089]"
              initial={false}
              animate={{ width: `${orderId ? pct : 0}%` }}
              transition={{ duration: 0.45 }}
            />
          </div>
        </div>
      </motion.section>

      {/* ── Middle: live notifications ── */}
      <section className="rounded-[24px] border border-border bg-white p-5 shadow-sm md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl font-semibold text-ink">Live kitchen updates</h2>
          <span className="text-xs font-semibold text-muted">
            {orderNotifs.length} update{orderNotifs.length === 1 ? '' : 's'}
          </span>
        </div>

        {orderNotifs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-cream-deep/60 px-4 py-8 text-center text-sm text-muted">
            Notifications will slide in here as the chef advances your order.
          </div>
        ) : (
          <ul className="max-h-52 space-y-2.5 overflow-y-auto pr-1">
            <AnimatePresence initial={false}>
              {orderNotifs.map((n) => (
                <motion.li
                  key={n.id}
                  layout
                  initial={{ opacity: 0, x: 40, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: 'auto' }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-start gap-3 rounded-2xl border border-orange/15 bg-gradient-to-r from-orange/[0.07] to-white px-4 py-3 shadow-sm">
                    <span className="mt-0.5 text-base leading-none">🔔</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-ink">
                        {n.text}
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted">
                        {new Date(n.at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </section>

      {/* ── Bottom: persistent AI chat ── */}
      <section className="flex min-h-[420px] flex-col overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_16px_48px_rgba(26,26,26,0.06)] md:min-h-[480px]">
        <div className="border-b border-border px-4 py-3">
          <div className="mb-3 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-orange/10 text-xl">
              {persona.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate font-semibold text-ink">
                {persona.characterName}
                <span className="font-normal text-muted"> · {persona.displayName}</span>
              </div>
              <div className="text-xs text-muted">
                {backendOnline ? '🟢 Companion online' : '🔴 Companion offline'} · chat is saved
              </div>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {PERSONAS.map((p) => {
              const active = p.key === persona.key
              return (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => {
                    setPersona(p.key)
                    setError('')
                  }}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    active
                      ? 'bg-orange text-white shadow-md shadow-orange/25'
                      : 'border border-border bg-cream-deep text-ink hover:border-orange/30'
                  }`}
                >
                  {p.emoji} {p.characterName}
                </button>
              )
            })}
          </div>
        </div>

        <div
          ref={chatPaneRef}
          className="flex-1 space-y-3 overflow-y-auto bg-[linear-gradient(180deg,#fafafa_0%,#ffffff_40%)] p-4"
        >
          {messages.length === 0 && (
            <div className="rounded-2xl border border-border bg-white p-4 text-sm text-muted shadow-sm">
              Hello! 😊 I&apos;m {persona.characterName}. Your conversation stays here while kitchen
              updates slide in above — ask me anything while you wait.
            </div>
          )}
          {messages.map((m, i) => (
            <motion.div
              key={`${persona.key}-${i}-${m.role}-${m.content.slice(0, 12)}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'ml-auto bg-orange text-white'
                  : 'bg-white text-ink shadow-sm ring-1 ring-border'
              }`}
            >
              {m.content}
            </motion.div>
          ))}
          {busy && (
            <div className="rounded-2xl bg-white px-4 py-3 text-sm text-muted shadow-sm ring-1 ring-border">
              {persona.characterName} is typing…
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {error && (
          <div className="border-t border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-800">
            {error}
          </div>
        )}

        <form onSubmit={send} className="flex gap-2 border-t border-border bg-white p-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message ${persona.characterName}…`}
            className="h-12 flex-1 rounded-full border border-border px-4 text-sm outline-none focus:border-orange/40 focus:ring-4 focus:ring-orange/10"
          />
          <button
            type="submit"
            disabled={busy}
            className="rounded-full bg-orange px-5 text-sm font-bold text-white disabled:opacity-60"
          >
            Send
          </button>
        </form>
      </section>
    </div>
  )
}
