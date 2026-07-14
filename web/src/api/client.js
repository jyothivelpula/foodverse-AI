const API_BASE =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:8000'
    : 'http://127.0.0.1:8000')

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }
  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`
  }

  let res
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    })
  } catch {
    throw new Error(
      `Cannot reach API at ${API_BASE}. Start the backend with: python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`,
    )
  }
  if (!res.ok) {
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

export const api = {
  async health() {
    return request('/health')
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

export { API_BASE }
