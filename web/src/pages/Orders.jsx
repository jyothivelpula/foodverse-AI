import { Link, useSearchParams } from 'react-router-dom'
import { ORDER_STAGES } from '../data/menu'
import { useStore } from '../store/useStore'

export default function Orders() {
  const [params] = useSearchParams()
  const placed = params.get('placed')
  const activeOrderId = useStore((s) => s.activeOrderId)
  const orderStageIndex = useStore((s) => s.orderStageIndex)
  const nextOrderStage = useStore((s) => s.nextOrderStage)
  const orderId = placed || activeOrderId

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-serif text-4xl font-semibold">Order Tracking</h1>
      {placed && (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-green-800">
          Order <strong>{placed}</strong> confirmed. Estimated prep: 20 minutes.
          <div className="mt-3">
            <Link to="/ai-lounge" className="font-bold text-orange underline">
              Enter AI Lounge →
            </Link>
          </div>
        </div>
      )}

      {!orderId ? (
        <p className="rounded-2xl border border-border bg-white p-6 text-muted">
          No active order. <Link to="/menu" className="text-orange font-semibold">Order something</Link>.
        </p>
      ) : (
        <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
          <div className="text-sm font-bold uppercase tracking-wider text-orange">
            Live · {orderId}
          </div>
          <h2 className="mt-2 font-serif text-2xl font-semibold">
            {ORDER_STAGES[orderStageIndex]}
          </h2>
          <ol className="mt-6 space-y-3">
            {ORDER_STAGES.map((stage, i) => (
              <li key={stage} className="flex items-center gap-3 text-sm">
                <span
                  className={`h-3 w-3 rounded-full ${
                    i <= orderStageIndex ? 'bg-orange' : 'border-2 border-gray-300'
                  }`}
                />
                <span className={i <= orderStageIndex ? 'font-semibold' : 'text-muted'}>
                  {stage}
                </span>
              </li>
            ))}
          </ol>
          {orderStageIndex < ORDER_STAGES.length - 1 && (
            <button
              type="button"
              onClick={nextOrderStage}
              className="mt-6 rounded-full border border-orange/30 bg-orange/10 px-5 py-2.5 text-sm font-bold text-orange"
            >
              Simulate next stage
            </button>
          )}
        </div>
      )}
    </div>
  )
}
