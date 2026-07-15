import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MENU_ITEMS } from '../data/menu'
import { PERSONAS } from '../data/personas'
import { api } from '../api/client'
import {
  DEFAULT_ESTIMATED_MINUTES,
  clearOrderTimer,
  saveOrderTimer,
} from '../utils/orderTimer'
import {
  normalizeServerOrder,
  nextStatus,
  progressPercent,
  statusLabel,
  notificationForStatus,
  shouldNotifyCustomer,
} from '../utils/orderStatus'

function upsertOrder(list, order) {
  return [order, ...list.filter((o) => o.id !== order.id)]
}

export const useStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      cart: [],
      favorites: [],
      customer: {
        name: '',
        phone: '',
        email: '',
        address: '',
      },
      kitchenOrders: [],
      liveOrder: null,
      notifications: [], // { id, orderId, status, text, at, read }
      toasts: [],
      notificationCenterOpen: false,
      connectionMode: null, // 'live' | 'polling' | null
      customerOrderStatus: null,
      activeOrderId: null,
      orderStartedAt: null,
      orderDurationSec: DEFAULT_ESTIMATED_MINUTES * 60,
      lastOrderItems: [],
      lastOrderTotal: 0,
      selectedPersona: PERSONAS[0].key,
      chatByPersona: {},
      reviews: [],
      backendOnline: null,
      menuItems: MENU_ITEMS,
      kitchenChefName: 'Marco',

      unreadNotificationCount: () =>
        get().notifications.filter((n) => !n.read).length,
      cartCount: () => get().cart.reduce((n, i) => n + i.quantity, 0),
      cartSubtotal: () =>
        get().cart.reduce((sum, i) => sum + i.price * i.quantity, 0),

      setAuth: ({ token, user }) => {
        const patch = { token, user }
        if (user) {
          patch.customer = {
            ...get().customer,
            name: user.name || get().customer.name,
            email: user.email || get().customer.email,
            phone: user.phone || get().customer.phone,
          }
        }
        set(patch)
      },

      logout: () => set({ token: null, user: null }),

      addToCart: (item, qty = 1) => {
        const cart = [...get().cart]
        const existing = cart.find((c) => c.id === item.id)
        if (existing) existing.quantity += qty
        else
          cart.push({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: qty,
            image: item.image,
          })
        set({ cart })
      },

      updateQty: (id, quantity) => {
        set({
          cart: get()
            .cart.map((c) => (c.id === id ? { ...c, quantity } : c))
            .filter((c) => c.quantity > 0),
        })
      },

      removeFromCart: (id) => set({ cart: get().cart.filter((c) => c.id !== id) }),
      clearCart: () => set({ cart: [] }),

      toggleFavorite: (id) => {
        const favs = get().favorites
        set({
          favorites: favs.includes(id) ? favs.filter((f) => f !== id) : [...favs, id],
        })
      },

      setCustomer: (patch) => set({ customer: { ...get().customer, ...patch } }),
      setConnectionMode: (mode) => set({ connectionMode: mode }),
      setNotificationCenterOpen: (open) => set({ notificationCenterOpen: open }),
      toggleNotificationCenter: () =>
        set({ notificationCenterOpen: !get().notificationCenterOpen }),

      pushCustomerNotification: ({ orderId, status, text, at }) => {
        if (!shouldNotifyCustomer(status)) return null

        const message = text || notificationForStatus(status)
        if (!message) return null

        const exists = get().notifications.some(
          (n) => n.orderId === orderId && n.status === status,
        )
        if (exists) return null

        const note = {
          id: `${orderId}-${status}-${at || Date.now()}`,
          orderId,
          status,
          text: message,
          at: at || Date.now(),
          read: false,
        }
        const toast = {
          id: `toast-${note.id}`,
          text: note.text,
          status: note.status,
          at: note.at,
        }
        set({
          notifications: [note, ...get().notifications].slice(0, 60),
          toasts: [toast, ...get().toasts].slice(0, 5),
        })
        return note
      },

      dismissToast: (id) =>
        set({ toasts: get().toasts.filter((t) => t.id !== id) }),

      pushToast: ({ text, tone = 'info' }) => {
        const toast = {
          id: `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          text,
          tone,
          at: Date.now(),
        }
        set({ toasts: [toast, ...get().toasts].slice(0, 5) })
        return toast
      },

      markNotificationRead: (id) =>
        set({
          notifications: get().notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n,
          ),
        }),

      markAllNotificationsRead: () =>
        set({
          notifications: get().notifications.map((n) => ({ ...n, read: true })),
        }),

      clearNotifications: () => set({ notifications: [], toasts: [] }),

      applyLiveOrder: (raw) => {
        const order = normalizeServerOrder(raw)
        if (!order) return

        const prev =
          get().liveOrder?.id === order.id
            ? get().liveOrder
            : get().kitchenOrders.find((o) => o.id === order.id)
        const statusChanged = !prev || prev.status !== order.status

        const patch = {
          kitchenOrders: upsertOrder(get().kitchenOrders, order),
        }

        if (get().activeOrderId === order.id) {
          patch.liveOrder = order
          patch.customerOrderStatus = order.status
          if (order.status === 'rejected') {
            try {
              clearOrderTimer()
            } catch {
              /* ignore */
            }
          }
        } else if (!get().activeOrderId && get().user?.role !== 'chef') {
          patch.liveOrder = order
          patch.customerOrderStatus = order.status
        }

        set(patch)

        if (statusChanged && get().activeOrderId === order.id) {
          get().pushCustomerNotification({
            orderId: order.id,
            status: order.status,
            text: notificationForStatus(order.status),
            at: order.updatedAt || Date.now(),
          })
          try {
            const bc = new BroadcastChannel('foodverse-orders')
            bc.postMessage({ type: 'order_update', order })
            bc.close()
          } catch {
            /* BroadcastChannel unsupported */
          }
        }
      },

      replaceKitchenOrders: (rawList) => {
        const orders = (rawList || []).map(normalizeServerOrder).filter(Boolean)
        set({ kitchenOrders: orders })
      },

      placeOrder: async (estimatedMinutes = DEFAULT_ESTIMATED_MINUTES) => {
        const localId = `FV-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
        const items = get().cart.map((c) => ({ ...c }))
        const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
        const startedAt = Date.now()
        const durationSec = Math.max(1, Math.round(estimatedMinutes * 60))
        const customer = get().customer
        const user = get().user
        const customerName = (customer.name || user?.name || 'Guest').trim() || 'Guest'
        const customerEmail = customer.email || user?.email || ''

        saveOrderTimer({ orderId: localId, startedAt, durationSec })

        let order = {
          id: localId,
          status: 'pending',
          items,
          total,
          createdAt: startedAt,
          updatedAt: startedAt,
          customerName,
          customerEmail,
          itemCount: items.reduce((n, i) => n + i.quantity, 0),
          estimatedMinutes,
          message: 'Order placed — waiting for the kitchen.',
          progressPercent: 0,
        }

        try {
          const server = await api.createOrder({
            order_id: localId,
            customer_name: customerName,
            customer_email: customerEmail,
            estimated_minutes: estimatedMinutes,
            items: items.map((i) => ({
              id: i.id,
              name: i.name,
              price: i.price,
              quantity: i.quantity,
              image: i.image,
            })),
          })
          order = normalizeServerOrder(server)
        } catch {
          // Offline / API down — keep local pending ticket
        }

        set({
          activeOrderId: order.id,
          orderStartedAt: startedAt,
          orderDurationSec: durationSec,
          lastOrderItems: items,
          lastOrderTotal: total,
          cart: [],
          customerOrderStatus: order.status,
          liveOrder: order,
          kitchenOrders: upsertOrder(get().kitchenOrders, order),
        })
        return order.id
      },

      acceptKitchenOrder: async (id) => {
        try {
          const server = await api.acceptOrder(id)
          get().applyLiveOrder(server)
          return
        } catch {
          /* local fallback */
        }
        const now = Date.now()
        const order = get().kitchenOrders.find((o) => o.id === id)
        get().applyLiveOrder({
          ...(order || { id }),
          status: 'accepted',
          acceptedAt: now,
          updatedAt: now,
          message: notificationForStatus('accepted'),
          progressPercent: progressPercent('accepted'),
        })
      },

      rejectKitchenOrder: async (id) => {
        try {
          const server = await api.rejectOrder(id)
          get().applyLiveOrder(server)
          return
        } catch {
          /* local fallback */
        }
        get().applyLiveOrder({
          ...(get().kitchenOrders.find((o) => o.id === id) || { id }),
          status: 'rejected',
          message: notificationForStatus('rejected'),
          updatedAt: Date.now(),
        })
      },

      advanceKitchenOrder: async (id) => {
        try {
          const server = await api.advanceOrder(id)
          get().applyLiveOrder(server)
          return
        } catch {
          /* local fallback below */
        }
        const current = get().kitchenOrders.find((o) => o.id === id)
        if (!current) return
        const nxt = nextStatus(current.status)
        if (!nxt) return
        get().applyLiveOrder({
          ...current,
          status: nxt,
          updatedAt: Date.now(),
          message: notificationForStatus(nxt) || `Status updated: ${statusLabel(nxt)}`,
          progressPercent: progressPercent(nxt),
        })
      },

      completeKitchenOrder: async (id) => {
        try {
          const server = await api.setOrderStatus(id, 'delivered')
          get().applyLiveOrder(server)
          return
        } catch {
          /* ignore */
        }
        get().applyLiveOrder({
          ...(get().kitchenOrders.find((o) => o.id === id) || { id }),
          status: 'delivered',
          updatedAt: Date.now(),
          message: notificationForStatus('delivered'),
          progressPercent: 100,
        })
      },

      updateKitchenOrderStatus: (id, status) => {
        if (status === 'accepted' || status === 'active') get().acceptKitchenOrder(id)
        else if (status === 'rejected') get().rejectKitchenOrder(id)
        else if (status === 'completed' || status === 'delivered') get().completeKitchenOrder(id)
        else get().advanceKitchenOrder(id)
      },

      setPersona: (key) => set({ selectedPersona: key }),
      getChat: (key) => get().chatByPersona[key || get().selectedPersona] || [],
      appendChat: (role, content, key) => {
        const k = key || get().selectedPersona
        const prev = get().chatByPersona[k] || []
        set({
          chatByPersona: {
            ...get().chatByPersona,
            [k]: [...prev, { role, content }],
          },
        })
      },
      clearChat: (key) => {
        const k = key || get().selectedPersona
        set({ chatByPersona: { ...get().chatByPersona, [k]: [] } })
      },
      addReview: (review) => set({ reviews: [review, ...get().reviews] }),
      setBackendOnline: (v) => set({ backendOnline: v }),
    }),
    {
      name: 'foodverse-store',
      partialize: (s) => ({
        token: s.token,
        user: s.user,
        cart: s.cart,
        favorites: s.favorites,
        customer: s.customer,
        kitchenOrders: s.kitchenOrders,
        liveOrder: s.liveOrder,
        notifications: s.notifications,
        customerOrderStatus: s.customerOrderStatus,
        activeOrderId: s.activeOrderId,
        orderStartedAt: s.orderStartedAt,
        orderDurationSec: s.orderDurationSec,
        lastOrderItems: s.lastOrderItems,
        lastOrderTotal: s.lastOrderTotal,
        selectedPersona: s.selectedPersona,
        chatByPersona: s.chatByPersona,
        reviews: s.reviews,
      }),
      merge: (persisted, current) => {
        const p = persisted && typeof persisted === 'object' ? persisted : {}
        // Drop legacy keys from the old multi-step / dual-notice system
        const {
          loungeNotifications: _ln,
          orderNotice: _on,
          orderStageIndex: _osi,
          ...rest
        } = p
        // Canonicalize any leftover kitchen order statuses
        if (Array.isArray(rest.kitchenOrders)) {
          rest.kitchenOrders = rest.kitchenOrders
            .map(normalizeServerOrder)
            .filter(Boolean)
        }
        if (rest.liveOrder) {
          rest.liveOrder = normalizeServerOrder(rest.liveOrder)
        }
        // Keep only milestone notifications
        if (Array.isArray(rest.notifications)) {
          rest.notifications = rest.notifications.filter((n) =>
            shouldNotifyCustomer(n.status),
          )
        }
        return { ...current, ...rest }
      },
    },
  ),
)
