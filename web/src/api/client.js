const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })
  if (!res.ok) {
    let detail = `Request failed (${res.status})`
    try {
      const data = await res.json()
      detail = data.detail || detail
    } catch {
      /* ignore */
    }
    throw new Error(typeof detail === 'string' ? detail : JSON.stringify(detail))
  }
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
  async sendChat({ personaKey, message, history }) {
    return request('/chat', {
      method: 'POST',
      body: JSON.stringify({
        persona_key: personaKey,
        message,
        history,
      }),
    })
  },
}

export { API_BASE }
