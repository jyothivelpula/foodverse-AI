import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import AiLounge from './pages/AiLounge'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Favorites from './pages/Favorites'
import { api } from './api/client'
import { useStore } from './store/useStore'

function BackendHealthPing() {
  const setBackendOnline = useStore((s) => s.setBackendOnline)
  useEffect(() => {
    let alive = true
    const ping = async () => {
      const ok = await api.isOnline()
      if (alive) setBackendOnline(ok)
    }
    ping()
    const id = setInterval(ping, 12000)
    return () => {
      alive = false
      clearInterval(id)
    }
  }, [setBackendOnline])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <BackendHealthPing />
      <Routes>
        {/* Landing dashboard — full-bleed, no app sidebar */}
        <Route index element={<Home />} />

        <Route element={<Layout />}>
          <Route path="menu" element={<Menu />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="orders" element={<Orders />} />
          <Route path="ai-lounge" element={<AiLounge />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
