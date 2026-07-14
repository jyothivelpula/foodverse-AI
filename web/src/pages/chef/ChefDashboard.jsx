import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Clock3,
  Flame,
  CircleCheck,
  IndianRupee,
  Package,
  Radio,
  TrendingUp,
  ChefHat,
  ArrowUpRight,
  Check,
  X,
} from 'lucide-react'
import { useStore } from '../../store/useStore'
import {
  isActivePipeline,
  isCompleted,
  isPending,
  statusLabel,
} from '../../utils/orderStatus'

const BRAND_GREEN = '#00a600'
const BRAND_ORANGE = '#FF5A1F'

function startOfToday() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

function formatTime(ts) {
  if (!ts) return '—'
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function StatCard({ label, value, icon: Icon, tone, delay = 0, to, accent }) {
  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      whileHover={{ y: -3 }}
      className={`relative overflow-hidden rounded-[22px] border border-border bg-white p-5 shadow-[0_10px_30px_rgba(26,26,26,0.05)] ${
        to ? 'cursor-pointer' : ''
      }`}
    >
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-[0.12]"
        style={{ background: accent }}
      />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">{label}</p>
          <p className="mt-2 font-serif text-3xl font-semibold text-ink">{value}</p>
        </div>
        <div className={`grid h-11 w-11 place-items-center rounded-2xl ${tone}`}>
          <Icon size={20} />
        </div>
      </div>
    </motion.div>
  )
  return to ? <Link to={to}>{inner}</Link> : inner
}

function PipelineChart({ pending, cooking, completed }) {
  const max = Math.max(pending, cooking, completed, 1)
  const rows = [
    { label: 'Pending', value: pending, color: BRAND_ORANGE },
    { label: 'Cooking', value: cooking, color: '#f59e0b' },
    { label: 'Completed', value: completed, color: BRAND_GREEN },
  ]
  return (
    <div className="space-y-4">
      {rows.map((r, i) => (
        <div key={r.label}>
          <div className="mb-1.5 flex justify-between text-xs font-semibold">
            <span className="text-ink">{r.label}</span>
            <span className="text-muted">{r.value}</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-cream-deep">
            <motion.div
              className="h-full rounded-full"
              style={{ background: r.color }}
              initial={{ width: 0 }}
              animate={{ width: `${(r.value / max) * 100}%` }}
              transition={{ delay: 0.15 + i * 0.08, duration: 0.55, ease: 'easeOut' }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function DonutChart({ pending, cooking, completed }) {
  const total = pending + cooking + completed || 1
  const segments = [
    { value: pending, color: BRAND_ORANGE },
    { value: cooking, color: '#f59e0b' },
    { value: completed, color: BRAND_GREEN },
  ]
  let offset = 0
  const r = 54
  const c = 2 * Math.PI * r

  return (
    <div className="relative mx-auto grid h-44 w-44 place-items-center">
      <svg viewBox="0 0 140 140" className="-rotate-90 h-full w-full">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#f3f3f3" strokeWidth="16" />
        {segments.map((s, i) => {
          const len = (s.value / total) * c
          const dash = `${len} ${c - len}`
          const el = (
            <motion.circle
              key={i}
              cx="70"
              cy="70"
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth="16"
              strokeLinecap="round"
              strokeDasharray={dash}
              strokeDashoffset={-offset}
              initial={{ strokeDasharray: `0 ${c}` }}
              animate={{ strokeDasharray: dash }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
            />
          )
          offset += len
          return el
        })}
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="font-serif text-2xl font-semibold text-ink">{pending + cooking + completed}</div>
          <div className="text-[10px] font-bold uppercase tracking-wide text-muted">Orders</div>
        </div>
      </div>
    </div>
  )
}

function RevenueBars({ orders }) {
  const bars = orders.slice(0, 8).reverse()
  const max = Math.max(...bars.map((o) => o.total || 0), 1)
  if (!bars.length) {
    return <p className="py-10 text-center text-sm text-muted">No completed revenue yet.</p>
  }
  return (
    <div className="flex h-44 items-end gap-2">
      {bars.map((o, i) => (
        <div key={o.id} className="flex flex-1 flex-col items-center gap-1">
          <motion.div
            className="w-full rounded-t-lg"
            style={{
              background: `linear-gradient(180deg, ${BRAND_ORANGE}, ${BRAND_GREEN})`,
              height: `${Math.max(8, ((o.total || 0) / max) * 100)}%`,
            }}
            initial={{ height: 0 }}
            animate={{ height: `${Math.max(8, ((o.total || 0) / max) * 100)}%` }}
            transition={{ delay: 0.1 + i * 0.05, duration: 0.45 }}
            title={`₹${(o.total || 0).toFixed(0)}`}
          />
          <span className="truncate text-[9px] font-semibold text-muted">
            {o.id?.slice(-4) || i + 1}
          </span>
        </div>
      ))}
    </div>
  )
}

function OrdersTable({ title, orders, empty, actions, accent = BRAND_ORANGE }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-[24px] border border-border bg-white shadow-[0_10px_30px_rgba(26,26,26,0.04)]"
    >
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: accent }} />
          <h3 className="font-serif text-xl font-semibold text-ink">{title}</h3>
        </div>
        <span className="rounded-full bg-cream-deep px-2.5 py-1 text-[11px] font-bold text-muted">
          {orders.length}
        </span>
      </div>
      {orders.length === 0 ? (
        <p className="px-5 py-12 text-center text-sm text-muted">{empty}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="bg-cream-deep/80 text-[11px] font-bold uppercase tracking-wide text-muted">
                <th className="px-5 py-3">Order</th>
                <th className="px-3 py-3">Customer</th>
                <th className="px-3 py-3">Items</th>
                <th className="px-3 py-3">Total</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Time</th>
                {actions && <th className="px-5 py-3 text-right">Action</th>}
              </tr>
            </thead>
            <tbody>
              {orders.map((o, i) => (
                <motion.tr
                  key={o.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-t border-border/80 hover:bg-orange/[0.03]"
                >
                  <td className="px-5 py-3.5 font-mono text-xs font-bold text-ink">{o.id}</td>
                  <td className="px-3 py-3.5 font-semibold text-ink">{o.customerName || 'Guest'}</td>
                  <td className="px-3 py-3.5 text-muted">
                    {o.itemCount ||
                      (o.items || []).reduce((n, it) => n + (it.quantity || 0), 0)}{' '}
                    pcs
                  </td>
                  <td className="px-3 py-3.5 font-bold text-ink">₹{(o.total || 0).toFixed(0)}</td>
                  <td className="px-3 py-3.5">
                    <span
                      className="inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide"
                      style={{
                        background: isPending(o.status)
                          ? 'rgba(255,90,31,0.12)'
                          : isCompleted(o.status)
                            ? 'rgba(0,166,0,0.12)'
                            : 'rgba(245,158,11,0.15)',
                        color: isPending(o.status)
                          ? BRAND_ORANGE
                          : isCompleted(o.status)
                            ? BRAND_GREEN
                            : '#b45309',
                      }}
                    >
                      {statusLabel(o.status)}
                    </span>
                  </td>
                  <td className="px-3 py-3.5 text-muted">{formatTime(o.createdAt || o.updatedAt)}</td>
                  {actions && (
                    <td className="px-5 py-3.5 text-right">{actions(o)}</td>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.section>
  )
}

export default function ChefDashboard() {
  const user = useStore((s) => s.user)
  const kitchenOrders = useStore((s) => s.kitchenOrders)
  const connectionMode = useStore((s) => s.connectionMode)
  const acceptKitchenOrder = useStore((s) => s.acceptKitchenOrder)
  const rejectKitchenOrder = useStore((s) => s.rejectKitchenOrder)
  const advanceKitchenOrder = useStore((s) => s.advanceKitchenOrder)
  const name = (user?.name || 'Chef').split(' ')[0]

  const analytics = useMemo(() => {
    const today = startOfToday()
    const todayOrders = kitchenOrders.filter((o) => (o.createdAt || 0) >= today)
    const pending = kitchenOrders.filter((o) => isPending(o.status))
    const cooking = kitchenOrders.filter((o) => isActivePipeline(o.status))
    const completed = kitchenOrders.filter((o) => isCompleted(o.status))
    const revenue = completed.reduce((sum, o) => sum + (o.total || 0), 0)

    const itemMap = new Map()
    kitchenOrders.forEach((o) => {
      ;(o.items || []).forEach((it) => {
        const key = it.name || 'Item'
        const prev = itemMap.get(key) || { name: key, qty: 0, revenue: 0 }
        prev.qty += it.quantity || 0
        prev.revenue += (it.price || 0) * (it.quantity || 0)
        itemMap.set(key, prev)
      })
    })
    const topSelling = [...itemMap.values()].sort((a, b) => b.qty - a.qty).slice(0, 5)
    const recent = [...kitchenOrders]
      .sort((a, b) => (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0))
      .slice(0, 6)

    return {
      todayCount: todayOrders.length || kitchenOrders.length,
      pending,
      cooking,
      cookingCount: cooking.length,
      completed,
      revenue,
      topSelling,
      recent,
    }
  }, [kitchenOrders])

  const maxTop = Math.max(...analytics.topSelling.map((t) => t.qty), 1)

  return (
    <div className="space-y-6 py-5 md:space-y-8 md:py-6">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[28px] border border-border p-6 text-white shadow-xl md:p-8"
        style={{
          background: `linear-gradient(135deg, #141414 0%, #1a2e1a 45%, #3d1f0f 100%)`,
        }}
      >
        <div
          className="pointer-events-none absolute -right-10 top-0 h-56 w-56 rounded-full blur-3xl"
          style={{ background: `${BRAND_ORANGE}33` }}
        />
        <div
          className="pointer-events-none absolute -left-8 bottom-0 h-40 w-40 rounded-full blur-3xl"
          style={{ background: `${BRAND_GREEN}40` }}
        />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em]">
                <ChefHat size={12} style={{ color: BRAND_ORANGE }} />
                Kitchen command
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide">
                <Radio
                  size={10}
                  className={connectionMode === 'live' ? 'text-green-400' : 'text-amber-300'}
                />
                {connectionMode === 'live'
                  ? 'Live'
                  : connectionMode === 'polling'
                    ? 'Polling'
                    : 'Connecting…'}
              </span>
            </div>
            <h1 className="mt-3 font-serif text-3xl font-semibold md:text-5xl">
              Welcome back, {name}
            </h1>
            <p className="mt-2 max-w-lg text-sm text-white/70 md:text-base">
              FoodVerse kitchen overview — orders, revenue, and top dishes in one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/chef/pending"
              className="inline-flex items-center gap-1 rounded-full px-4 py-2.5 text-sm font-bold text-white"
              style={{ background: BRAND_ORANGE }}
            >
              Review pending <ArrowUpRight size={16} />
            </Link>
            <Link
              to="/chef/analytics"
              className="inline-flex items-center gap-1 rounded-full border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-bold text-white backdrop-blur"
            >
              Full analytics
            </Link>
          </div>
        </div>
      </motion.section>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Today's Orders"
          value={analytics.todayCount}
          icon={Package}
          tone="bg-[#00a600]/10 text-[#00a600]"
          accent={BRAND_GREEN}
          delay={0}
        />
        <StatCard
          label="Pending"
          value={analytics.pending.length}
          icon={Clock3}
          tone="bg-orange/10 text-orange"
          accent={BRAND_ORANGE}
          delay={0.05}
          to="/chef/pending"
        />
        <StatCard
          label="Cooking"
          value={analytics.cookingCount}
          icon={Flame}
          tone="bg-amber-50 text-amber-700"
          accent="#f59e0b"
          delay={0.1}
          to="/chef/active"
        />
        <StatCard
          label="Completed"
          value={analytics.completed.length}
          icon={CircleCheck}
          tone="bg-[#00a600]/10 text-[#00a600]"
          accent={BRAND_GREEN}
          delay={0.15}
          to="/chef/completed"
        />
        <StatCard
          label="Revenue"
          value={`₹${analytics.revenue.toFixed(0)}`}
          icon={IndianRupee}
          tone="bg-orange/10 text-orange"
          accent={BRAND_ORANGE}
          delay={0.2}
          to="/chef/analytics"
        />
      </div>

      {/* Charts + top selling */}
      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr_1fr]">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="rounded-[24px] border border-border bg-white p-5 shadow-sm md:p-6"
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-serif text-xl font-semibold">Order pipeline</h2>
            <TrendingUp size={16} style={{ color: BRAND_GREEN }} />
          </div>
          <PipelineChart
            pending={analytics.pending.length}
            cooking={analytics.cookingCount}
            completed={analytics.completed.length}
          />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="rounded-[24px] border border-border bg-white p-5 shadow-sm md:p-6"
        >
          <h2 className="mb-2 font-serif text-xl font-semibold">Status mix</h2>
          <p className="mb-2 text-xs text-muted">Pending · Cooking · Completed</p>
          <DonutChart
            pending={analytics.pending.length}
            cooking={analytics.cookingCount}
            completed={analytics.completed.length}
          />
          <div className="mt-2 flex justify-center gap-4 text-[11px] font-semibold">
            <span className="flex items-center gap-1.5">
              <i className="h-2 w-2 rounded-full" style={{ background: BRAND_ORANGE }} /> Pending
            </span>
            <span className="flex items-center gap-1.5">
              <i className="h-2 w-2 rounded-full bg-amber-500" /> Cooking
            </span>
            <span className="flex items-center gap-1.5">
              <i className="h-2 w-2 rounded-full" style={{ background: BRAND_GREEN }} /> Done
            </span>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="rounded-[24px] border border-border bg-white p-5 shadow-sm md:p-6"
        >
          <h2 className="mb-1 font-serif text-xl font-semibold">Revenue bars</h2>
          <p className="mb-4 text-xs text-muted">Recent completed tickets</p>
          <RevenueBars orders={analytics.completed} />
        </motion.section>
      </div>

      {/* Top selling + recent */}
      <div className="grid gap-5 lg:grid-cols-2">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[24px] border border-border bg-white p-5 shadow-sm md:p-6"
        >
          <h2 className="font-serif text-xl font-semibold">Top selling food</h2>
          <p className="mt-1 text-xs text-muted">By quantity across kitchen tickets</p>
          {analytics.topSelling.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted">No item data yet.</p>
          ) : (
            <ul className="mt-5 space-y-3">
              {analytics.topSelling.map((item, i) => (
                <li key={item.name} className="flex items-center gap-3">
                  <span
                    className="grid h-8 w-8 place-items-center rounded-xl text-xs font-bold text-white"
                    style={{ background: i === 0 ? BRAND_ORANGE : BRAND_GREEN }}
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between gap-2 text-sm">
                      <span className="truncate font-semibold text-ink">{item.name}</span>
                      <span className="shrink-0 text-muted">{item.qty} sold</span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-cream-deep">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${BRAND_ORANGE}, ${BRAND_GREEN})`,
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.qty / maxTop) * 100}%` }}
                        transition={{ delay: 0.1 + i * 0.06, duration: 0.45 }}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-bold text-ink">₹{item.revenue.toFixed(0)}</span>
                </li>
              ))}
            </ul>
          )}
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[24px] border border-border bg-white p-5 shadow-sm md:p-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-semibold">Recent orders</h2>
            <Link to="/chef/active" className="text-xs font-bold text-orange hover:underline">
              See active
            </Link>
          </div>
          {analytics.recent.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted">No recent orders.</p>
          ) : (
            <ul className="mt-4 space-y-2.5">
              {analytics.recent.map((o, i) => (
                <motion.li
                  key={o.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-border px-3.5 py-3 hover:border-orange/25"
                >
                  <div className="min-w-0">
                    <div className="truncate font-mono text-xs font-bold text-ink">{o.id}</div>
                    <div className="truncate text-xs text-muted">
                      {o.customerName || 'Guest'} · {statusLabel(o.status)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-ink">₹{(o.total || 0).toFixed(0)}</div>
                    <div className="text-[10px] text-muted">{formatTime(o.updatedAt || o.createdAt)}</div>
                  </div>
                </motion.li>
              ))}
            </ul>
          )}
        </motion.section>
      </div>

      {/* Tables */}
      <OrdersTable
        title="Pending Orders"
        orders={analytics.pending.slice(0, 8)}
        empty="No pending orders — kitchen is clear."
        accent={BRAND_ORANGE}
        actions={(o) => (
          <div className="inline-flex gap-1.5">
            <button
              type="button"
              onClick={() => acceptKitchenOrder(o.id)}
              className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-bold text-white"
              style={{ background: BRAND_GREEN }}
            >
              <Check size={12} /> Accept
            </button>
            <button
              type="button"
              onClick={() => rejectKitchenOrder(o.id)}
              className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-[11px] font-bold text-red-600"
            >
              <X size={12} /> Reject
            </button>
          </div>
        )}
      />

      <OrdersTable
        title="Active Orders"
        orders={analytics.cooking.slice(0, 8)}
        empty="No active cooking tickets."
        accent={BRAND_GREEN}
        actions={(o) => (
          <button
            type="button"
            onClick={() => advanceKitchenOrder(o.id)}
            className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-bold text-white"
            style={{ background: BRAND_ORANGE }}
          >
            Advance <ArrowUpRight size={12} />
          </button>
        )}
      />
    </div>
  )
}
