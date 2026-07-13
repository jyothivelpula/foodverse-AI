/** Client-only order countdown helpers (no backend). */

export const ORDER_TIMER_KEY = 'fv_order_timer'
export const DEFAULT_ESTIMATED_MINUTES = 30

export const TRACKING_STEPS = [
  'Order Confirmed',
  'Preparing Ingredients',
  'Cooking',
  'Packing',
  'Out for Delivery',
  'Delivered',
]

export function saveOrderTimer({ orderId, startedAt, durationSec }) {
  const payload = { orderId, startedAt, durationSec }
  localStorage.setItem(ORDER_TIMER_KEY, JSON.stringify(payload))
  return payload
}

export function loadOrderTimer() {
  try {
    const raw = localStorage.getItem(ORDER_TIMER_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (!data?.orderId || !data?.startedAt || !data?.durationSec) return null
    return data
  } catch {
    return null
  }
}

export function clearOrderTimer() {
  localStorage.removeItem(ORDER_TIMER_KEY)
}

export function getRemainingSec(startedAt, durationSec, now = Date.now()) {
  const elapsed = Math.floor((now - startedAt) / 1000)
  return Math.max(0, durationSec - elapsed)
}

/** Map remaining seconds to tracking step index (0–5) for a 30-min style timeline. */
export function getTrackingStageIndex(remainingSec, durationSec) {
  if (remainingSec <= 0) return TRACKING_STEPS.length - 1

  // Split duration into 5 equal buckets before Delivered (matches 30→24→18→12→6→0)
  const slice = durationSec / 5
  if (remainingSec > slice * 4) return 0 // Confirmed
  if (remainingSec > slice * 3) return 1 // Preparing
  if (remainingSec > slice * 2) return 2 // Cooking
  if (remainingSec > slice * 1) return 3 // Packing
  return 4 // Out for Delivery
}

export function formatCountdown(totalSec) {
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
