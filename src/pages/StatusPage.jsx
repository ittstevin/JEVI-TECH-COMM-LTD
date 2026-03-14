import { useEffect, useState } from 'react'

const services = [
  { name: 'Core network', status: 'ok' },
  { name: 'Wi-Fi provisioning', status: 'ok' },
  { name: 'Billing', status: 'ok' },
  { name: 'Customer portal', status: 'ok' },
]

export default function StatusPage() {
  const [currentServices, setCurrentServices] = useState(services)
  const [lastUpdated, setLastUpdated] = useState(Date.now())

  useEffect(() => {
    const id = window.setInterval(() => {
      setCurrentServices((prev) =>
        prev.map((service) => {
          if (Math.random() < 0.05) {
            const statuses = ['ok', 'maintenance', 'outage']
            const currentIndex = statuses.indexOf(service.status)
            const nextIndex = (currentIndex + 1) % statuses.length
            return { ...service, status: statuses[nextIndex] }
          }
          return service
        }),
      )
      setLastUpdated(Date.now())
    }, 8000)

    return () => window.clearInterval(id)
  }, [])

  function statusBadge(status) {
    switch (status) {
      case 'ok':
        return 'bg-emerald-50 text-emerald-700'
      case 'maintenance':
        return 'bg-yellow-50 text-amber-700'
      case 'outage':
        return 'bg-rose-50 text-rose-700'
      default:
        return 'bg-slate-50 text-slate-700'
    }
  }

  return (
    <div className="space-y-10">
      <header className="rounded-3xl bg-white/80 p-8 shadow-soft">
        <h1 className="text-3xl font-semibold text-slate-900">Network status</h1>
        <p className="mt-2 text-sm text-slate-600">
          Monitor system health and see any planned maintenance or outages.
        </p>
      </header>

      <section className="rounded-3xl bg-white/80 p-8 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-slate-600">
            Last updated: {new Date(lastUpdated).toLocaleTimeString()}
          </p>
          <p className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
            Current status: All systems nominal
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {currentServices.map((service) => (
            <div
              key={service.name}
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-6 py-5"
            >
              <p className="text-sm font-semibold text-slate-900">{service.name}</p>
              <span
                className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-semibold ${statusBadge(
                  service.status,
                )}`}
              >
                {service.status}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-lg font-semibold text-slate-900">Scheduled maintenance</h2>
          <p className="mt-2 text-sm text-slate-600">
            We schedule routine maintenance between 2:00 AM and 4:00 AM local time to
            minimize disruption. Any planned windows will be posted here.
          </p>
        </div>
      </section>
    </div>
  )
}
