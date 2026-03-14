import { useMemo } from 'react'

export default function PlanCard({ plan, onSubscribe, highlight }) {
  const badge = useMemo(() => {
    if (highlight) return 'Most popular'
    if (plan.bestValue) return 'Best value'
    return null
  }, [highlight, plan.bestValue])

  return (
    <div
      className={`card relative flex flex-col gap-4 p-6 transition hover:-translate-y-1 hover:shadow-lg ${
        highlight ? 'border-brand-300 ring-2 ring-brand-100' : ''
      }`}
    >
      {badge ? (
        <span className="absolute right-4 top-4 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
          {badge}
        </span>
      ) : null}

      <div>
        <p className="text-sm font-semibold text-slate-500">{plan.name}</p>
        <div className="mt-3 flex items-end gap-2">
          <span className="text-4xl font-semibold text-slate-900">{plan.speed}</span>
          <span className="text-sm font-medium text-slate-500">Mbps</span>
        </div>
        <p className="text-sm text-slate-500">Up to {plan.download} download speed</p>
      </div>

      <div className="flex-1">
        <p className="text-3xl font-semibold text-slate-900">{plan.price}</p>
        <p className="text-sm text-slate-500">per month</p>
      </div>

      <ul className="space-y-2 text-sm text-slate-600">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-50 text-brand-600">
              ✓
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="mt-4 block rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-brand-500/30 hover:bg-brand-700"
        onClick={() => onSubscribe(plan)}
      >
        Subscribe
      </button>
    </div>
  )
}
