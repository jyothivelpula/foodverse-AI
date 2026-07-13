import { useEffect, useRef, useState } from 'react'
import { PERSONAS } from '../data/personas'
import { useStore } from '../store/useStore'
import { api } from '../api/client'

export default function AiLounge() {
  const selectedPersona = useStore((s) => s.selectedPersona)
  const setPersona = useStore((s) => s.setPersona)
  const getChat = useStore((s) => s.getChat)
  const appendChat = useStore((s) => s.appendChat)
  const clearChat = useStore((s) => s.clearChat)
  const backendOnline = useStore((s) => s.backendOnline)
  const setBackendOnline = useStore((s) => s.setBackendOnline)

  const [view, setView] = useState('gallery')
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef(null)

  const persona = PERSONAS.find((p) => p.key === selectedPersona) || PERSONAS[0]
  const messages = getChat(persona.key)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, busy])

  const openChat = (key) => {
    setPersona(key)
    setView('chat')
    setError('')
  }

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
      // history already includes the message we just appended
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

  if (view === 'gallery') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-4xl font-semibold">AI Lounge</h1>
          <p className="text-muted">Pick a companion and chat while you wait.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {PERSONAS.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => openChat(p.key)}
              className="rounded-[20px] border border-border bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative mb-3 inline-grid h-14 w-14 place-items-center rounded-2xl bg-orange/10 text-2xl">
                {p.emoji}
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
              </div>
              <div className="font-serif text-lg font-semibold">{p.characterName}</div>
              <div className="text-sm font-semibold text-orange">{p.displayName}</div>
              <p className="mt-1 text-sm text-muted">{p.tagline}</p>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto flex h-[min(720px,calc(100vh-8rem))] max-w-3xl flex-col overflow-hidden rounded-3xl border border-border bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <button
          type="button"
          onClick={() => setView('gallery')}
          className="rounded-xl border border-border px-3 py-1.5 text-sm font-semibold"
        >
          ←
        </button>
        <div className="text-2xl">{persona.emoji}</div>
        <div className="min-w-0 flex-1">
          <div className="truncate font-semibold">
            {persona.characterName} · {persona.displayName}
          </div>
          <div className="text-xs text-muted">
            {backendOnline ? '🟢 API Online' : '🔴 API Offline'} · {persona.tagline}
          </div>
        </div>
        <button
          type="button"
          onClick={() => clearChat(persona.key)}
          className="text-xs font-semibold text-muted hover:text-ink"
        >
          Clear
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto bg-cream-deep/40 p-4">
        {messages.length === 0 && (
          <div className="rounded-2xl bg-white p-4 text-sm text-muted shadow-sm">
            Hello! 😊 I&apos;m {persona.characterName}. How&apos;s your day going?
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={`${i}-${m.role}`}
            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              m.role === 'user'
                ? 'ml-auto bg-orange text-white'
                : 'bg-white text-ink shadow-sm'
            }`}
          >
            {m.content}
          </div>
        ))}
        {busy && (
          <div className="rounded-2xl bg-white px-4 py-3 text-sm text-muted shadow-sm">
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

      <form onSubmit={send} className="flex gap-2 border-t border-border p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Message ${persona.characterName}...`}
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
    </div>
  )
}
