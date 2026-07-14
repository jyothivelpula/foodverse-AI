import { motion } from 'framer-motion'

const ILLUSTRATIONS = {
  cart: '🛒',
  orders: '📦',
  search: '🔍',
  favorites: '♡',
  chat: '✨',
  kitchen: '👨‍🍳',
  default: '🍽',
}

export default function EmptyState({
  title = 'Nothing here yet',
  hint,
  action,
  actionLabel,
  illustration = 'default',
  className = '',
}) {
  const emoji = ILLUSTRATIONS[illustration] || ILLUSTRATIONS.default

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={`glass flex flex-col items-center justify-center rounded-[28px] px-6 py-14 text-center ${className}`}
    >
      <div className="relative mb-5">
        <div className="absolute inset-0 scale-150 rounded-full bg-orange/10 blur-2xl" />
        <div className="relative grid h-20 w-20 place-items-center rounded-[28px] bg-gradient-to-br from-orange/15 to-[#00a600]/15 text-4xl shadow-inner">
          {emoji}
        </div>
      </div>
      <h3 className="font-serif text-2xl font-semibold text-ink">{title}</h3>
      {hint && <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">{hint}</p>}
      {action && actionLabel && (
        <button
          type="button"
          onClick={action}
          className="mt-6 rounded-full bg-orange px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange/25 transition hover:scale-105 hover:bg-orange-hover"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  )
}
