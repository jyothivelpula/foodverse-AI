import { motion } from 'framer-motion'
import {
  Check,
  X,
  Clock3,
  User,
  Hash,
  ShoppingBag,
  IndianRupee,
  Flame,
  CircleCheck,
  ChevronRight,
} from 'lucide-react'
import {
  isActivePipeline,
  isCompleted,
  isPending,
  nextStatus,
  statusLabel,
} from '../../utils/orderStatus'

const STATUS_STYLES = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  accepted: 'bg-green-50 text-green-700 border-green-200',
  cooking: 'bg-orange/10 text-orange border-orange/25',
  delivered: 'bg-green-50 text-green-700 border-green-200',
  rejected: 'bg-red-50 text-red-600 border-red-200',
}

function formatOrderTime(ts) {
  if (!ts) return '—'
  return new Date(ts).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export default function KitchenOrderCard({
  order,
  index = 0,
  onAccept,
  onReject,
  onAdvance,
  showActions = true,
}) {
  const style = STATUS_STYLES[order.status] || STATUS_STYLES.pending
  const label = order.statusLabel || statusLabel(order.status)
  const nxt = order.nextStatus || nextStatus(order.status)
  const nxtLabel = order.nextStatusLabel || (nxt ? statusLabel(nxt) : null)
  const itemCount =
    order.itemCount ||
    (order.items || []).reduce((n, i) => n + (i.quantity || 0), 0)
  const pct = order.progressPercent ?? 0

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96, y: -8 }}
      transition={{ delay: Math.min(index * 0.05, 0.3), duration: 0.28 }}
      className="glass-strong overflow-hidden rounded-[24px]"
    >
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border bg-gradient-to-r from-cream-deep to-white px-5 py-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
            <Hash size={12} />
            Order ID
          </div>
          <h3 className="font-mono text-lg font-bold text-ink">{order.id}</h3>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${style}`}
        >
          {isPending(order.status) && <Clock3 size={12} />}
          {isActivePipeline(order.status) && <Flame size={12} />}
          {isCompleted(order.status) && <CircleCheck size={12} />}
          {order.status === 'rejected' && <X size={12} />}
          {label}
        </span>
      </div>

      <div className="space-y-4 px-5 py-4">
        {!isPending(order.status) && order.status !== 'rejected' && (
          <div>
            <div className="mb-1.5 flex justify-between text-xs font-semibold text-muted">
              <span>Progress</span>
              <span>{pct}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-cream-deep">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-orange to-[#ff8a5c]"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 grid h-8 w-8 place-items-center rounded-xl bg-orange/10 text-orange">
              <User size={15} />
            </span>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wide text-muted">
                Customer Name
              </div>
              <div className="text-sm font-semibold text-ink">
                {order.customerName || 'Guest'}
              </div>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 grid h-8 w-8 place-items-center rounded-xl bg-sky-50 text-sky-600">
              <Clock3 size={15} />
            </span>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wide text-muted">
                Order Time
              </div>
              <div className="text-sm font-semibold text-ink">
                {formatOrderTime(order.createdAt)}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-muted">
            <ShoppingBag size={12} />
            Ordered Items
            <span className="rounded-full bg-cream-deep px-2 py-0.5 text-[10px] text-ink">
              Qty {itemCount}
            </span>
          </div>
          <ul className="space-y-2 rounded-2xl border border-border bg-cream-deep/50 p-3">
            {(order.items || []).map((item) => (
              <li
                key={`${order.id}-${item.id}-${item.name}`}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="min-w-0 truncate font-medium text-ink">{item.name}</span>
                <span className="shrink-0 rounded-lg bg-white px-2 py-0.5 text-xs font-bold text-muted shadow-sm">
                  ×{item.quantity}
                </span>
                <span className="shrink-0 tabular-nums text-muted">
                  ₹{(item.price * item.quantity).toFixed(0)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-border bg-ink px-4 py-3 text-white">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-white/70">
            <IndianRupee size={14} />
            Total Price
          </span>
          <span className="text-xl font-bold tabular-nums">
            ₹{(order.total || 0).toFixed(0)}
          </span>
        </div>

        {showActions && isPending(order.status) && (
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={() => onAccept?.(order.id)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#00a600] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-green-600/20 transition hover:scale-[1.02] hover:brightness-110"
            >
              <Check size={16} strokeWidth={2.8} />
              Accept Order
            </button>
            <button
              type="button"
              onClick={() => onReject?.(order.id)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition hover:scale-[1.02] hover:bg-red-100"
            >
              <X size={16} strokeWidth={2.8} />
              Reject Order
            </button>
          </div>
        )}

        {showActions && isActivePipeline(order.status) && nxt && (
          <button
            type="button"
            onClick={() => onAdvance?.(order.id)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange px-4 py-3 text-sm font-bold text-white shadow-lg shadow-orange/25 transition hover:scale-[1.01] hover:bg-orange-hover"
          >
            Advance to {nxtLabel}
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </motion.article>
  )
}

export function KitchenEmptyState({ title, hint }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass flex flex-col items-center justify-center rounded-[28px] border border-dashed border-border px-6 py-16 text-center"
    >
      <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-orange/15 to-[#00a600]/15 text-muted">
        <Clock3 size={22} />
      </div>
      <p className="font-semibold text-ink">{title}</p>
      {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
    </motion.div>
  )
}
