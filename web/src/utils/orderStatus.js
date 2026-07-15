/** Live order tracking — pending → accepted → cooking → delivered. */

export const ORDER_FLOW = ['pending', 'accepted', 'cooking', 'delivered']

export const STATUS_LABELS = {
  pending: 'Pending',
  accepted: 'Accepted',
  cooking: 'Cooking',
  delivered: 'Done',
  rejected: 'Rejected',
}

/** Leftover multi-step statuses from the old pipeline. */
const LEGACY_STATUS_MAP = {
  preparing_ingredients: 'cooking',
  quality_check: 'cooking',
  packing: 'cooking',
  ready: 'delivered',
  out_for_delivery: 'delivered',
}

export function canonicalizeStatus(status) {
  return LEGACY_STATUS_MAP[status] || status
}

export const ACTIVE_STATUSES = ['accepted', 'cooking']

export function statusLabel(status) {
  const s = canonicalizeStatus(status)
  return STATUS_LABELS[s] || s
}

export function statusIndex(status) {
  const i = ORDER_FLOW.indexOf(canonicalizeStatus(status))
  return i >= 0 ? i : 0
}

export function progressPercent(status) {
  if (canonicalizeStatus(status) === 'rejected') return 0
  const i = statusIndex(status)
  if (ORDER_FLOW.length <= 1) return 100
  return Math.round((i / (ORDER_FLOW.length - 1)) * 100)
}

export function nextStatus(status) {
  const i = ORDER_FLOW.indexOf(canonicalizeStatus(status))
  if (i < 0 || i >= ORDER_FLOW.length - 1) return null
  // Chef advances from accepted → cooking → delivered (pending needs Accept)
  if (canonicalizeStatus(status) === 'pending') return null
  return ORDER_FLOW[i + 1]
}

export function normalizeServerOrder(order) {
  if (!order) return null
  const status = canonicalizeStatus(order.status)
  return {
    id: order.id,
    status,
    items: order.items || [],
    total: order.total ?? 0,
    createdAt: order.created_at ?? order.createdAt ?? Date.now(),
    updatedAt: order.updated_at ?? order.updatedAt ?? Date.now(),
    customerName: order.customer_name ?? order.customerName ?? 'Guest',
    customerEmail: order.customer_email ?? order.customerEmail ?? '',
    itemCount: order.item_count ?? order.itemCount ?? 0,
    estimatedMinutes: order.estimated_minutes ?? order.estimatedMinutes ?? 30,
    message: order.message || notificationForStatus(status) || '',
    statusLabel: order.status_label || statusLabel(status),
    progressPercent: order.progress_percent ?? progressPercent(status),
    nextStatus: order.next_status ?? nextStatus(status),
    nextStatusLabel:
      order.next_status_label ||
      statusLabel(order.next_status || nextStatus(status) || ''),
  }
}

export function isPending(status) {
  return canonicalizeStatus(status) === 'pending'
}

export function isActivePipeline(status) {
  return ACTIVE_STATUSES.includes(canonicalizeStatus(status))
}

export function isCompleted(status) {
  return canonicalizeStatus(status) === 'delivered'
}

export function isRejected(status) {
  return canonicalizeStatus(status) === 'rejected'
}

/** Customer real-time milestones only. */
export const CUSTOMER_NOTIFY_STATUSES = ['accepted', 'cooking', 'delivered']

export const NOTIFICATION_COPY = {
  accepted: '👨‍🍳 Chef accepted your order.',
  cooking: '🔥 Your food is now Cooking',
  delivered: '🎉 Done',
  rejected: '❌ Your order has been rejected.',
}

export const NOTIFICATION_TITLE = {
  accepted: 'Chef Update',
  cooking: 'Chef Update',
  delivered: 'Chef Update',
  rejected: 'Order Update',
}

export function notificationForStatus(status) {
  const s = canonicalizeStatus(status)
  if (!CUSTOMER_NOTIFY_STATUSES.includes(s) && s !== 'rejected') return null
  return NOTIFICATION_COPY[s] || null
}

export function notificationTitleForStatus(status) {
  const s = canonicalizeStatus(status)
  return NOTIFICATION_TITLE[s] || 'Chef Update'
}

export function shouldNotifyCustomer(status) {
  const s = canonicalizeStatus(status)
  return CUSTOMER_NOTIFY_STATUSES.includes(s) || s === 'rejected'
}
