/**
 * API base URL resolution.
 *
 * On Vercel we use same-origin `/api` (proxied to Render via vercel.json)
 * so the browser never does a cross-origin fetch to onrender.com.
 * That avoids "Cannot reach API" / Failed to fetch CORS-style failures.
 */
function resolveApiBase() {
  const env = String(import.meta.env.VITE_API_URL || '')
    .trim()
    .replace(/\/$/, '')

  if (typeof window !== 'undefined') {
    const host = window.location.hostname
    const onVercel = host.endsWith('.vercel.app')
    // Force same-origin proxy on Vercel even if env still points at Render
    if (onVercel && (!env || /onrender\.com/i.test(env))) {
      return '/api'
    }
  }

  if (env) return env

  // Local Vite — prefer direct backend (vite also proxies /api → :8000)
  if (import.meta.env.DEV) {
    return 'http://localhost:8000'
  }

  return '/api'
}

const API_BASE = resolveApiBase()

/** Direct Render origin for WebSockets (Vercel cannot proxy WS upgrades). */
const WS_ORIGIN = (
  import.meta.env.VITE_WS_URL ||
  import.meta.env.VITE_API_URL ||
  'https://foodverse-ai-1.onrender.com'
)
  .toString()
  .trim()
  .replace(/\/$/, '')
  .replace(/^wss:/i, 'https:')
  .replace(/^ws:/i, 'http:')

const USES_PROXY = API_BASE === '/api' || API_BASE.startsWith('/api/')
const IS_REMOTE =
  USES_PROXY ||
  (/^https?:\/\//i.test(API_BASE) && !/localhost|127\.0\.0\.1/i.test(API_BASE))

function unreachableMessage() {
  if (USES_PROXY) {
    return `Cannot reach API (via /api proxy). Wake the Render service at https://foodverse-ai-1.onrender.com/health — free tier sleeps when idle — then retry.`
  }
  if (IS_REMOTE) {
    return `Cannot reach API at ${API_BASE}. Open that /health URL in a new tab to wake Render, wait ~30–60s, then retry.`
  }
  return `Cannot reach API at ${API_BASE}. Start the backend with: python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }
  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`
  }

  const retries = options.retries ?? (IS_REMOTE ? 3 : 0)
  const { retries: _r, token: _t, ...fetchOpts } = options

  let lastNetworkError = null
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    let res
    try {
      res = await fetch(`${API_BASE}${path}`, {
        ...fetchOpts,
        headers,
      })
    } catch (err) {
      lastNetworkError = err
      if (attempt < retries) {
        await sleep(1500 * 2 ** attempt)
        continue
      }
      throw new Error(unreachableMessage())
    }

    if (!res.ok) {
      if ([502, 503, 504].includes(res.status) && attempt < retries) {
        await sleep(1500 * 2 ** attempt)
        continue
      }
      let detail = `Request failed (${res.status})`
      try {
        const data = await res.json()
        detail = data.detail || detail
        if (Array.isArray(detail)) {
          detail = detail.map((d) => d.msg || JSON.stringify(d)).join(', ')
        }
      } catch {
        /* ignore */
      }
      throw new Error(typeof detail === 'string' ? detail : JSON.stringify(detail))
    }
    if (res.status === 204) return null
    return res.json()
  }

  throw new Error(unreachableMessage())
}

export const api = {
  async health() {
    return request('/health', { retries: IS_REMOTE ? 4 : 1 })
  },
  async isOnline() {
    try {
      const data = await this.health()
      return data?.status === 'ok'
    } catch {
      return false
    }
  },
  async login({ email, password }) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },
  async register({ name, email, password, role, phone }) {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role, phone }),
    })
  },
  async me(token) {
    return request('/auth/me', { token })
  },
  async sendChat({ personaKey, message, history, token }) {
    return request('/chat', {
      method: 'POST',
      token,
      body: JSON.stringify({
        persona_key: personaKey,
        message,
        history,
      }),
    })
  },

  // Live orders
  async createOrder(body) {
    return request('/orders', { method: 'POST', body: JSON.stringify(body) })
  },
  async listOrders(status) {
    const q = status ? `?status=${encodeURIComponent(status)}` : ''
    return request(`/orders${q}`)
  },
  async getOrder(orderId) {
    return request(`/orders/${orderId}`)
  },
  async acceptOrder(orderId) {
    return request(`/orders/${orderId}/accept`, { method: 'POST' })
  },
  async rejectOrder(orderId) {
    return request(`/orders/${orderId}/reject`, { method: 'POST' })
  },
  async advanceOrder(orderId) {
    return request(`/orders/${orderId}/advance`, { method: 'POST' })
  },
  async setOrderStatus(orderId, status, message) {
    return request(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, message }),
    })
  },
}

export { API_BASE, WS_ORIGIN }
