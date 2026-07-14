import { useMemo } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useStore } from '../../store/useStore'
import KitchenOrderCard, { KitchenEmptyState } from '../../components/chef/KitchenOrderCard'
import { isActivePipeline, isCompleted, isPending } from '../../utils/orderStatus'

export function ChefPendingOrders() {
  const kitchenOrders = useStore((s) => s.kitchenOrders)
  const acceptKitchenOrder = useStore((s) => s.acceptKitchenOrder)
  const rejectKitchenOrder = useStore((s) => s.rejectKitchenOrder)
  const orders = useMemo(
    () => kitchenOrders.filter((o) => isPending(o.status)),
    [kitchenOrders],
  )

  return (
    <div className="space-y-6 py-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-4xl font-semibold">Pending Orders</h1>
          <p className="mt-1 text-sm text-muted">
            Live queue — accept to confirm, or reject to notify the customer.
          </p>
        </div>
        <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
          {orders.length} waiting
        </span>
      </header>

      {orders.length === 0 ? (
        <KitchenEmptyState
          title="No pending orders"
          hint="When a customer places an order, it appears here in real time."
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {orders.map((order, i) => (
              <KitchenOrderCard
                key={order.id}
                order={order}
                index={i}
                onAccept={acceptKitchenOrder}
                onReject={rejectKitchenOrder}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

export function ChefActiveOrders() {
  const kitchenOrders = useStore((s) => s.kitchenOrders)
  const advanceKitchenOrder = useStore((s) => s.advanceKitchenOrder)
  const orders = useMemo(
    () => kitchenOrders.filter((o) => isActivePipeline(o.status)),
    [kitchenOrders],
  )

  return (
    <div className="space-y-6 py-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-4xl font-semibold">Active Orders</h1>
          <p className="mt-1 text-sm text-muted">
            One-click advance moves the customer timeline instantly.
          </p>
        </div>
        <span className="rounded-full bg-orange/10 px-3 py-1.5 text-xs font-bold text-orange">
          {orders.length} in kitchen
        </span>
      </header>

      {orders.length === 0 ? (
        <KitchenEmptyState
          title="No active orders"
          hint="Accept a pending order, then advance: Cooking → Done."
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {orders.map((order, i) => (
              <KitchenOrderCard
                key={order.id}
                order={order}
                index={i}
                onAdvance={advanceKitchenOrder}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

export function ChefCompletedOrders() {
  const kitchenOrders = useStore((s) => s.kitchenOrders)
  const orders = useMemo(
    () => kitchenOrders.filter((o) => isCompleted(o.status)),
    [kitchenOrders],
  )

  return (
    <div className="space-y-6 py-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-4xl font-semibold">Completed Orders</h1>
          <p className="mt-1 text-sm text-muted">Delivered successfully</p>
        </div>
        <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
          {orders.length} done
        </span>
      </header>

      {orders.length === 0 ? (
        <KitchenEmptyState title="No completed orders yet." />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {orders.map((order, i) => (
              <KitchenOrderCard
                key={order.id}
                order={order}
                index={i}
                showActions={false}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
