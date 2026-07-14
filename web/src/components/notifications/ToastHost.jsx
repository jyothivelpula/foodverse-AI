import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useStore } from '../../store/useStore'

export default function ToastHost() {
  const user = useStore((s) => s.user)
  const toasts = useStore((s) => s.toasts)
  const dismissToast = useStore((s) => s.dismissToast)

  // Only customers see order toasts (chef admin shouldn't be interrupted)
  const visible = user?.role === 'customer' ? toasts : []

  useEffect(() => {
    if (!visible.length) return undefined
    const timers = visible.map((t) =>
      window.setTimeout(() => dismissToast(t.id), 4500),
    )
    return () => timers.forEach((id) => clearTimeout(id))
  }, [visible, dismissToast])

  if (user?.role !== 'customer') return null

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[80] flex flex-col items-end gap-2 px-4 md:top-5 md:px-6">
      <AnimatePresence>
        {visible.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -16, x: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
            className="pointer-events-auto glass-strong flex w-full max-w-sm items-start gap-3 rounded-2xl p-4"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold leading-snug text-ink">{t.text}</p>
              <p className="mt-1 text-[11px] text-muted">
                {new Date(t.at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </p>
            </div>
            <button
              type="button"
              onClick={() => dismissToast(t.id)}
              className="rounded-lg p-1 text-muted hover:bg-cream-deep hover:text-ink"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
