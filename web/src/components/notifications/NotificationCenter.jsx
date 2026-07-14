import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, CheckCheck, X } from 'lucide-react'
import { useStore } from '../../store/useStore'

function formatWhen(ts) {
  const d = new Date(ts)
  const now = Date.now()
  const diff = Math.max(0, Math.floor((now - ts) / 1000))
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  return d.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function NotificationCenter() {
  const open = useStore((s) => s.notificationCenterOpen)
  const setOpen = useStore((s) => s.setNotificationCenterOpen)
  const notifications = useStore((s) => s.notifications)
  const markNotificationRead = useStore((s) => s.markNotificationRead)
  const markAllNotificationsRead = useStore((s) => s.markAllNotificationsRead)

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close notifications"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/25"
            onClick={() => setOpen(false)}
          />
          <motion.aside
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="glass-strong fixed right-3 top-[4.5rem] z-[75] flex max-h-[min(70vh,560px)] w-[min(100vw-1.5rem,380px)] flex-col overflow-hidden rounded-[24px] md:right-6"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-orange" />
                <h2 className="font-semibold text-ink">Notifications</h2>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={markAllNotificationsRead}
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[11px] font-bold text-muted hover:bg-cream-deep hover:text-ink"
                  title="Mark all read"
                >
                  <CheckCheck size={14} />
                  Read all
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-1.5 text-muted hover:bg-cream-deep"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-12 text-center text-sm text-muted">
                  No notifications yet. Kitchen updates will appear here.
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {notifications.map((n) => (
                    <li key={n.id}>
                      <button
                        type="button"
                        onClick={() => markNotificationRead(n.id)}
                        className={`flex w-full gap-3 px-4 py-3.5 text-left transition hover:bg-cream-deep/80 ${
                          n.read ? 'bg-white' : 'bg-orange/[0.06]'
                        }`}
                      >
                        {!n.read && (
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-orange" />
                        )}
                        <div className={`min-w-0 flex-1 ${n.read ? 'pl-4' : ''}`}>
                          <p className="text-sm font-semibold leading-snug text-ink">
                            {n.text}
                          </p>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted">
                            <span>{formatWhen(n.at)}</span>
                            {n.orderId && (
                              <>
                                <span>·</span>
                                <span className="font-mono">{n.orderId}</span>
                              </>
                            )}
                            <span>·</span>
                            <span>
                              {new Date(n.at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-t border-border px-4 py-3">
              <Link
                to="/orders"
                onClick={() => setOpen(false)}
                className="block rounded-full bg-orange py-2.5 text-center text-sm font-bold text-white"
              >
                View order tracking
              </Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
