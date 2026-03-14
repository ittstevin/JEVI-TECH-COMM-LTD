import { useEffect, useMemo, useState } from 'react'

export default function SpeedIndicator({ base = 300, variance = 150 }) {
  const [speed, setSpeed] = useState(base)

  const formatted = useMemo(() => `${speed} Mbps`, [speed])

  useEffect(() => {
    const interval = setInterval(() => {
      const next = base + Math.round((Math.random() - 0.5) * variance)
      setSpeed(Math.max(10, next))
    }, 1500)
    return () => clearInterval(interval)
  }, [base, variance])

  return (
    <div className="relative flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white/70 p-6 text-center shadow-sm">
      <div className="flex items-center gap-2 text-3xl font-semibold text-slate-900">
        <span className="text-brand-600">{formatted}</span>
        <span className="text-sm font-medium text-slate-500">avg.</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-brand-600 transition-all"
          style={{ width: `${Math.min(100, (speed / (base + variance)) * 100)}%` }}
        />
      </div>
      <p className="text-sm text-slate-500">Real-time speed indicator</p>
    </div>
  )
}
