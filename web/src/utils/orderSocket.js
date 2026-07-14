import { API_BASE } from '../api/client'

function toWsUrl(path) {
  let base = API_BASE.replace(/\/$/, '')
  // Align host with the page to avoid CORS quirks (localhost vs 127.0.0.1)
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    base = base.replace('127.0.0.1', 'localhost')
  }
  if (base.startsWith('https://')) return `wss://${base.slice(8)}${path}`
  if (base.startsWith('http://')) return `ws://${base.slice(7)}${path}`
  return `ws://localhost:8000${path}`
}

/**
 * Connect to a JSON WebSocket with auto-reconnect + polling fallback callback.
 */
export function connectJsonSocket({
  path,
  onMessage,
  onStatus,
  pollFallback,
  pollMs = 3000,
}) {
  let ws = null
  let closed = false
  let pollId = null
  let pingId = null
  let retry = 0

  const stopPoll = () => {
    if (pollId) {
      clearInterval(pollId)
      pollId = null
    }
  }

  const startPoll = () => {
    if (!pollFallback || pollId) return
    pollFallback()
    pollId = setInterval(() => {
      if (!closed) pollFallback()
    }, pollMs)
  }

  const cleanupSocket = () => {
    if (pingId) {
      clearInterval(pingId)
      pingId = null
    }
    if (ws) {
      try {
        ws.close()
      } catch {
        /* ignore */
      }
      ws = null
    }
  }

  const connect = () => {
    if (closed) return
    cleanupSocket()
    try {
      ws = new WebSocket(toWsUrl(path))
    } catch {
      onStatus?.('polling')
      startPoll()
      return
    }

    ws.onopen = () => {
      retry = 0
      onStatus?.('live')
      stopPoll()
      pingId = setInterval(() => {
        if (ws?.readyState === WebSocket.OPEN) ws.send('ping')
      }, 20000)
    }

    ws.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data)
        if (data?.type === 'pong') return
        onMessage?.(data)
      } catch {
        /* ignore bad frames */
      }
    }

    ws.onerror = () => {
      /* onclose handles reconnect */
    }

    ws.onclose = () => {
      cleanupSocket()
      if (closed) return
      onStatus?.('polling')
      startPoll()
      const delay = Math.min(10000, 1000 * 2 ** retry)
      retry += 1
      setTimeout(connect, delay)
    }
  }

  connect()

  return () => {
    closed = true
    stopPoll()
    cleanupSocket()
  }
}
