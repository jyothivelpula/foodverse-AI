import { useState } from 'react'

export default function Settings() {
  const [settings, setSettings] = useState({
    notifications: true,
    orderUpdates: true,
    aiSuggestions: true,
  })

  const toggle = (key) => setSettings((s) => ({ ...s, [key]: !s[key] }))

  return (
    <div className="mx-auto max-w-xl space-y-4 rounded-3xl border border-border bg-white p-6 shadow-sm">
      <h1 className="font-serif text-4xl font-semibold">Settings</h1>
      {[
        ['notifications', 'Notifications'],
        ['orderUpdates', 'Order updates'],
        ['aiSuggestions', 'AI suggestions'],
      ].map(([key, label]) => (
        <label
          key={key}
          className="flex cursor-pointer items-center justify-between rounded-2xl border border-border px-4 py-3"
        >
          <span className="font-semibold">{label}</span>
          <input
            type="checkbox"
            checked={settings[key]}
            onChange={() => toggle(key)}
            className="h-4 w-4 accent-orange"
          />
        </label>
      ))}
    </div>
  )
}
