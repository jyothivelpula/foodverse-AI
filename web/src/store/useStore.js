import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MENU_ITEMS } from '../data/menu'
import { PERSONAS } from '../data/personas'

export const useStore = create(
  persist(
    (set, get) => ({
      cart: [],
      favorites: [],
      customer: {
        name: 'Jyothi',
        phone: '',
        email: '',
        address: '',
      },
      activeOrderId: null,
      orderStageIndex: 0,
      selectedPersona: PERSONAS[0].key,
      chatByPersona: {},
      reviews: [],
      backendOnline: null,
      menuItems: MENU_ITEMS,

      cartCount: () => get().cart.reduce((n, i) => n + i.quantity, 0),
      cartSubtotal: () =>
        get().cart.reduce((sum, i) => sum + i.price * i.quantity, 0),

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

      placeOrder: () => {
        const id = `FV-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
        set({
          activeOrderId: id,
          orderStageIndex: 0,
          cart: [],
        })
        return id
      },

      nextOrderStage: () => {
        const next = Math.min(get().orderStageIndex + 1, 4)
        set({ orderStageIndex: next })
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
        set({
          chatByPersona: { ...get().chatByPersona, [k]: [] },
        })
      },

      addReview: (review) => set({ reviews: [review, ...get().reviews] }),

      setBackendOnline: (v) => set({ backendOnline: v }),
    }),
    {
      name: 'foodverse-store',
      partialize: (s) => ({
        cart: s.cart,
        favorites: s.favorites,
        customer: s.customer,
        activeOrderId: s.activeOrderId,
        orderStageIndex: s.orderStageIndex,
        selectedPersona: s.selectedPersona,
        chatByPersona: s.chatByPersona,
        reviews: s.reviews,
      }),
    },
  ),
)
