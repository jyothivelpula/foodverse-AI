import { Outlet } from 'react-router-dom'

/** Layout shell for AI Lounge nested routes — content area only (no extra sidebar). */
export default function AiLoungeLayout() {
  return (
    <div className="mx-auto max-w-6xl page-shell py-2">
      <Outlet />
    </div>
  )
}
