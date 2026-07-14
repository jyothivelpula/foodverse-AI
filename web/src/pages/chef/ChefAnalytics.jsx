import { useMemo } from 'react'
import { useStore } from '../../store/useStore'
import { isActivePipeline, isCompleted, isPending } from '../../utils/orderStatus'

export default function ChefAnalytics() {
  const kitchenOrders = useStore((s) => s.kitchenOrders)

  const stats = useMemo(() => {
    const pending = kitchenOrders.filter((o) => isPending(o.status)).length
    const active = kitchenOrders.filter((o) => isActivePipeline(o.status)).length
    const completed = kitchenOrders.filter((o) => isCompleted(o.status))
    const revenue = completed.reduce((sum, o) => sum + (o.total || 0), 0)
    const itemsSold = completed.reduce(
      (sum, o) => sum + (o.items || []).reduce((n, i) => n + i.quantity, 0),
      0,
    )
    const avgTicket = completed.length ? revenue / completed.length : 0
    return { pending, active, completed: completed.length, revenue, itemsSold, avgTicket }
  }, [kitchenOrders])

  const rows = [
    ['Pending queue', stats.pending],
    ['Active cooking', stats.active],
    ['Completed today', stats.completed],
    ['Items sold', stats.itemsSold],
    ['Avg ticket', `₹${stats.avgTicket.toFixed(0)}`],
    ['Total revenue', `₹${stats.revenue.toFixed(0)}`],
  ]

  const maxBar = Math.max(stats.pending, stats.active, stats.completed, 1)

  return (
    <div className="space-y-6 py-6">
      <header>
        <h1 className="font-serif text-4xl font-semibold">Analytics</h1>
        <p className="mt-1 text-sm text-muted">Kitchen performance snapshot</p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          ['Revenue', `₹${stats.revenue.toFixed(0)}`],
          ['Orders done', stats.completed],
          ['In kitchen', stats.pending + stats.active],
        ].map(([label, value]) => (
          <div key={label} className="rounded-3xl border border-border bg-white p-5 shadow-sm">
            <div className="text-sm text-muted">{label}</div>
            <div className="mt-1 text-3xl font-bold text-ink">{value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-semibold text-ink">Order pipeline</h2>
        <div className="space-y-4">
          {[
            ['Pending', stats.pending, 'bg-amber-500'],
            ['Active', stats.active, 'bg-orange'],
            ['Completed', stats.completed, 'bg-[#00a600]'],
          ].map(([label, value, color]) => (
            <div key={label}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-medium">{label}</span>
                <span className="text-muted">{value}</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-cream-deep">
                <div
                  className={`h-full rounded-full ${color}`}
                  style={{ width: `${(value / maxBar) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream-deep text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-5 py-3 font-semibold">Metric</th>
              <th className="px-5 py-3 font-semibold">Value</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, value]) => (
              <tr key={label} className="border-t border-border">
                <td className="px-5 py-3 font-medium text-ink">{label}</td>
                <td className="px-5 py-3 text-muted">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
