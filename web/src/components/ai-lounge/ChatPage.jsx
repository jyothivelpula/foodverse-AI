import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Loader2, Trash2 } from 'lucide-react'
import { api } from '../../api/client'
import { useStore } from '../../store/useStore'
import { chatStorageKey } from '../../data/aiLounge'
import ConfirmDialog from '../ui/ConfirmDialog'

/**
 * Reusable chat surface for a lounge assistant.
 * Uses existing chat API via assistant.personaKey; local history keyed by category+assistant.
 */
export default function ChatPage({ category, assistant }) {
  const storageKey = chatStorageKey(category.id, assistant.id)
  const getChat = useStore((s) => s.getChat)
  const appendChat = useStore((s) => s.appendChat)
  const clearChat = useStore((s) => s.clearChat)
  const pushToast = useStore((s) => s.pushToast)
  const backendOnline = useStore((s) => s.backendOnline)
  const setBackendOnline = useStore((s) => s.setBackendOnline)

  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [confirmClear, setConfirmClear] = useState(false)
  const bottomRef = useRef(null)

  const messages = getChat(storageKey)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, busy])

  const handleClear = () => {
    clearChat(storageKey)
    setError('')
    setInput('')
    setConfirmClear(false)
    pushToast({ text: 'Conversation cleared successfully.', tone: 'success' })
  }

  const send = async (e) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || busy) return
    setInput('')
    setError('')
    appendChat('user', text, storageKey)
    setBusy(true)
    try {
      const history = getChat(storageKey).map((m) => ({
        role: m.role,
        content: m.content,
      }))
      const data = await api.sendChat({
        personaKey: assistant.personaKey,
        message: text,
        history: history.slice(0, -1),
      })
      appendChat('assistant', data.reply, storageKey)
      setBackendOnline(true)
    } catch (err) {
      setBackendOnline(false)
      const msg =
        err?.message ||
        'Could not reach chat. Start the backend with uvicorn and set GROQ_API_KEY.'
      setError(msg)
      appendChat('assistant', `⚠️ ${msg}`, storageKey)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-[560px] flex-col overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_16px_48px_rgba(26,26,26,0.06)]">
      <div className="border-b border-border px-4 py-3 sm:px-5">
        <Link
          to={`/ai-lounge/${category.id}`}
          className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition hover:text-orange"
        >
          <ArrowLeft size={14} />
          Back to {category.title}
        </Link>
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#5CA47B]/12 text-2xl">
            {assistant.icon}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-serif text-xl font-semibold text-ink sm:text-2xl">
              {assistant.icon} {assistant.title} AI
            </h1>
            <p className="text-xs font-semibold text-muted">
              {backendOnline === false ? (
                <span className="text-red-600">🔴 Offline</span>
              ) : (
                <span className="text-[#5CA47B]">🟢 Online</span>
              )}
            </p>
          </div>
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setConfirmClear(true)}
            disabled={messages.length === 0 && !error}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#5CA47B]/30 bg-[#5CA47B]/10 px-3.5 py-2 text-xs font-bold text-[#5CA47B] transition hover:bg-[#5CA47B] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Clear chat"
          >
            <Trash2 size={14} strokeWidth={2.4} />
            Clear
          </motion.button>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto bg-[linear-gradient(180deg,#fafafa_0%,#ffffff_40%)] p-4">
        <AnimatePresence mode="wait">
          {messages.length === 0 ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="rounded-2xl border border-[#5CA47B]/20 bg-gradient-to-br from-[#5CA47B]/08 to-white p-5 text-sm leading-relaxed text-ink shadow-sm"
            >
              <p className="text-base font-semibold">Welcome!</p>
              <p className="mt-1.5">{assistant.welcome}</p>
            </motion.div>
          ) : (
            <motion.div key="thread" className="space-y-3">
              {messages.map((m, i) => (
                <motion.div
                  key={`${storageKey}-${i}-${m.role}-${m.content.slice(0, 12)}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'ml-auto bg-[#5CA47B] text-white'
                      : 'bg-white text-ink shadow-sm ring-1 ring-border'
                  }`}
                >
                  {m.content}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        {busy && (
          <div className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm text-muted shadow-sm ring-1 ring-border">
            <Loader2 size={14} className="animate-spin" />
            {assistant.title} is typing…
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
          placeholder="Message..."
          className="h-12 flex-1 rounded-full border border-border px-4 text-sm outline-none focus:border-[#5CA47B]/40 focus:ring-4 focus:ring-[#5CA47B]/10"
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-[#5CA47B] px-5 text-sm font-bold text-white shadow-md shadow-[#5CA47B]/20 transition hover:brightness-105 disabled:opacity-60"
        >
          Send
        </button>
      </form>

      <ConfirmDialog
        open={confirmClear}
        title="Clear conversation?"
        description="Are you sure you want to clear this conversation?"
        cancelLabel="Cancel"
        confirmLabel="Clear Chat"
        onCancel={() => setConfirmClear(false)}
        onConfirm={handleClear}
      />
    </div>
  )
}
