import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ChefLayout from './components/layout/ChefLayout'
import { GuestOnly, RequireAuth, RequireRole } from './components/auth/ProtectedRoute'
import Home from './pages/Home'
import CustomerHome from './pages/CustomerHome'
import Menu from './pages/Menu'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import AiLounge from './pages/AiLounge'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Favorites from './pages/Favorites'
import Login from './pages/Login'
import Register from './pages/Register'
import ChefDashboard from './pages/chef/ChefDashboard'
import {
  ChefPendingOrders,
  ChefActiveOrders,
  ChefCompletedOrders,
} from './pages/chef/ChefOrders'
import ChefAnalytics from './pages/chef/ChefAnalytics'
import ChefProfile from './pages/chef/ChefProfile'
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
        {/* Public marketing landing */}
        <Route index element={<Home />} />

        <Route element={<GuestOnly />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Customer area */}
        <Route element={<RequireAuth />}>
          <Route element={<RequireRole roles={['customer']} />}>
            <Route element={<Layout />}>
              <Route path="home" element={<CustomerHome />} />
              <Route path="menu" element={<Menu />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="orders" element={<Orders />} />
              <Route path="ai-lounge" element={<AiLounge />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
              <Route path="favorites" element={<Favorites />} />
            </Route>
          </Route>

          {/* Chef area */}
          <Route element={<RequireRole roles={['chef']} />}>
            <Route path="chef" element={<ChefLayout />}>
              <Route index element={<ChefDashboard />} />
              <Route path="pending" element={<ChefPendingOrders />} />
              <Route path="active" element={<ChefActiveOrders />} />
              <Route path="completed" element={<ChefCompletedOrders />} />
              <Route path="analytics" element={<ChefAnalytics />} />
              <Route path="profile" element={<ChefProfile />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
