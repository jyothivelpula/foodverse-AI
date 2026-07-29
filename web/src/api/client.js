/**
 * API base URL resolution.
 *
 * On Vercel, call the working Render service directly. The monorepo often
 * deploys without applying web/vercel.json, so /api/* returns 404.
 */
const WORKING_RENDER_API = 'https://foodverse-ai-geef.onrender.com'

function resolveApiBase() {
  const env = String(import.meta.env.VITE_API_URL || '')
    .trim()
    .replace(/\/$/, '')

  if (typeof window !== 'undefined' && window.location.hostname.endsWith('.vercel.app')) {
    // Absolute env URL is fine unless it points at the broken old service
    if (env && /^https?:\/\//i.test(env) && !/foodverse-ai-1\.onrender\.com/i.test(env)) {
      return env
    }
    return WORKING_RENDER_API
  }

  if (env && /^https?:\/\//i.test(env)) return env
  if (env) return env

  if (import.meta.env.DEV) return 'http://localhost:8000'
  return WORKING_RENDER_API
}

const API_BASE = resolveApiBase()
const DEFAULT_RENDER_ORIGIN = WORKING_RENDER_API

/** Direct backend origin for WebSockets. */
function resolveWsOrigin() {
  const explicit = String(import.meta.env.VITE_WS_URL || '')
    .trim()
    .replace(/\/$/, '')
  if (explicit) {
    return explicit.replace(/^wss:/i, 'https:').replace(/^ws:/i, 'http:')
  }
  if (API_BASE.startsWith('http')) return API_BASE
  if (import.meta.env.DEV) return 'http://localhost:8000'
  return DEFAULT_RENDER_ORIGIN
}

const WS_ORIGIN = resolveWsOrigin()

const USES_PROXY = API_BASE === '/api' || API_BASE.startsWith('/api/')
const IS_REMOTE =
  USES_PROXY ||
  (/^https?:\/\//i.test(API_BASE) && !/localhost|127\.0\.0\.1/i.test(API_BASE))

function unreachableMessage() {
  if (IS_REMOTE) {
    return `Cannot reach API at ${API_BASE}. Open ${WORKING_RENDER_API}/health to wake Render, wait ~30–60s, then retry.`
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

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    let res
    try {
      res = await fetch(`${API_BASE}${path}`, {
        ...fetchOpts,
        headers,
      })
    } catch {
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
  async forgotPassword({ email }) {
    return request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  },
  async verifyOtp({ email, otp }) {
    return request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    })
  },
  async resendOtp({ email }) {
    return request('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  },
  async resetPassword({ token, newPassword }) {
    return request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, new_password: newPassword }),
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
