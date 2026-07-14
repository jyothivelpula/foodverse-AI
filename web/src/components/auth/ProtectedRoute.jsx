import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useStore } from '../../store/useStore'

/** Requires a valid JWT session. */
export function RequireAuth() {
  const token = useStore((s) => s.token)
  const location = useLocation()
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return <Outlet />
}

/** Only allow the given role(s); otherwise send user to their home. */
export function RequireRole({ roles }) {
  const token = useStore((s) => s.token)
  const user = useStore((s) => s.user)
  const location = useLocation()

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (!roles.includes(user.role)) {
    const dest = user.role === 'chef' ? '/chef' : '/home'
    return <Navigate to={dest} replace />
  }

  return <Outlet />
}

/** Redirect authenticated users away from login/register. */
export function GuestOnly() {
  const token = useStore((s) => s.token)
  const user = useStore((s) => s.user)
  if (token && user) {
    return <Navigate to={user.role === 'chef' ? '/chef' : '/home'} replace />
  }
  return <Outlet />
}
