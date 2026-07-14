import { useEffect } from 'react'
import { api } from '../api/client'
import { useStore } from '../store/useStore'
import { connectJsonSocket } from '../utils/orderSocket'

/** Customer: live status for one order (WebSocket + poll + cross-tab). */
export function useOrderTracking(orderId) {
  const applyLiveOrder = useStore((s) => s.applyLiveOrder)
  const setConnectionMode = useStore((s) => s.setConnectionMode)

  useEffect(() => {
    if (!orderId) return undefined

    const poll = async () => {
      try {
        const order = await api.getOrder(orderId)
        applyLiveOrder(order)
      } catch {
        /* keep last known */
      }
    }

    const disconnect = connectJsonSocket({
      path: `/ws/orders/${orderId}`,
      onMessage: (msg) => {
        if (msg?.order) applyLiveOrder(msg.order)
      },
      onStatus: setConnectionMode,
      pollFallback: poll,
      pollMs: 2500,
    })

    let bc
    try {
      bc = new BroadcastChannel('foodverse-orders')
      bc.onmessage = (ev) => {
        if (ev.data?.type === 'order_update' && ev.data?.order?.id === orderId) {
          applyLiveOrder(ev.data.order)
        }
      }
    } catch {
      /* ignore */
    }

    // Immediate refresh so we don't wait for the first poll tick
    poll()

    return () => {
      disconnect()
      setConnectionMode(null)
      try {
        bc?.close()
      } catch {
        /* ignore */
      }
    }
  }, [orderId, applyLiveOrder, setConnectionMode])
}

/** Chef: kitchen board sync (WebSocket + poll fallback). */
export function useKitchenFeed(enabled = true) {
  const replaceKitchenOrders = useStore((s) => s.replaceKitchenOrders)
  const applyLiveOrder = useStore((s) => s.applyLiveOrder)
  const setConnectionMode = useStore((s) => s.setConnectionMode)

  useEffect(() => {
    if (!enabled) return undefined

    const poll = async () => {
      try {
        const orders = await api.listOrders()
        replaceKitchenOrders(orders)
      } catch {
        /* keep local */
      }
    }

    const disconnect = connectJsonSocket({
      path: '/ws/kitchen',
      onMessage: (msg) => {
        if (msg?.type === 'snapshot' && Array.isArray(msg.orders)) {
          replaceKitchenOrders(msg.orders)
          return
        }
        if (msg?.order) applyLiveOrder(msg.order)
      },
      onStatus: setConnectionMode,
      pollFallback: poll,
      pollMs: 2500,
    })

    let bc
    try {
      bc = new BroadcastChannel('foodverse-orders')
      bc.onmessage = (ev) => {
        if (ev.data?.type === 'order_update' && ev.data?.order) {
          applyLiveOrder(ev.data.order)
        }
      }
    } catch {
      /* ignore */
    }

    poll()

    return () => {
      disconnect()
      setConnectionMode(null)
      try {
        bc?.close()
      } catch {
        /* ignore */
      }
    }
  }, [enabled, replaceKitchenOrders, applyLiveOrder, setConnectionMode])
}
