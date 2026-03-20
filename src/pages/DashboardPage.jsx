import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPlanById } from '../services/plans'
import { clearUser, getUser, setUser } from '../services/user'

function formatDate(timestamp) {
  if (!timestamp) return 'Not set'
  const date = new Date(timestamp)
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const [user, setUserState] = useState(getUser())
  const [usage, setUsage] = useState({ used: 0, limit: 1000 })
  const [isRenewing, setIsRenewing] = useState(false)

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      navigate('/admin')
      return
    }
  }, [user, navigate])

  useEffect(() => {
    // Simulate usage tracking
    const id = window.setInterval(() => {
      setUsage((prev) => {
        const nextUsed = Math.min(prev.limit, prev.used + Math.round(Math.random() * 35))
        return { ...prev, used: nextUsed }
      })
    }, 3500)

    return () => window.clearInterval(id)
  }, [])

  // Calculate default next billing date once
  const [defaultNextBilling] = useState(() => Date.now() + 30 * 24 * 60 * 60 * 1000)

  // Provide default subscription data if user doesn't have any
  const defaultSubscription = useMemo(() => ({
    planId: 'basic',
    nextBilling: defaultNextBilling,
    status: 'ACTIVE'
  }), [defaultNextBilling])

  const subscription = useMemo(() => user?.subscription || defaultSubscription, [user?.subscription, defaultSubscription])

  const plan = useMemo(() => getPlanById(subscription.planId), [subscription.planId])
  const nextBilling = subscription.nextBilling

  function handleRenew() {
    if (!user) return
    setIsRenewing(true)
    window.setTimeout(() => {
      const updated = setUser({
        ...user,
        subscription: {
          ...subscription,
          nextBilling: Date.now() + 30 * 24 * 60 * 60 * 1000,
        },
      })
      setUserState(updated)
      setIsRenewing(false)
    }, 900)
  }

  function handleLogout() {
    clearUser()
    navigate('/')
  }

  if (!user) {
    return (
      <div className="rounded-3xl bg-white/80 p-10 shadow-soft">
        <h1 className="text-3xl font-semibold text-slate-900">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-600">
          Create an account to view your dashboard and manage your plan.
        </p>
        <button
          type="button"
          onClick={() => navigate('/signup')}
          className="mt-6 rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
        >
          Sign up now
        </button>
      </div>
    )
  }

  const usagePercent = Math.min(100, Math.round((usage.used / usage.limit) * 100))

  return (
    <div className="space-y-10">
      <header className="rounded-3xl bg-white/80 p-8 shadow-soft">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Customer dashboard</h1>
            <p className="mt-2 text-sm text-slate-600">
              Manage your plan, check usage, and stay on top of your billing.
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            Sign out
          </button>
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="card">
          <h2 className="text-lg font-semibold text-slate-900">Current plan</h2>
          <p className="mt-2 text-sm text-slate-600">{plan.name}</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{plan.speed} Mbps</p>
          <p className="mt-2 text-sm text-slate-500">Next billing: {formatDate(nextBilling)}</p>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-slate-900">Internet usage</h2>
          <p className="mt-2 text-sm text-slate-600">
            Estimated monthly usage (simulated)
          </p>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>{usage.used} GB used</span>
              <span>{usage.limit} GB</span>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-brand-600 transition-all"
                style={{ width: `${usagePercent}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {usagePercent}% of the estimated monthly allowance.
            </p>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-slate-900">Billing status</h2>
          <p className="mt-2 text-sm text-slate-600">
            Your next payment is scheduled for {formatDate(nextBilling)}.
          </p>
          <button
            type="button"
            className="mt-6 w-full rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
            onClick={handleRenew}
            disabled={isRenewing}
          >
            {isRenewing ? 'Renewing…' : 'Renew subscription'}
          </button>
        </div>
      </section>

      <section className="rounded-3xl bg-white/80 p-8 shadow-soft">
        <h2 className="text-2xl font-semibold text-slate-900">Support</h2>
        <p className="mt-2 text-sm text-slate-600">
          Need help? Our support team is standing by.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="font-semibold text-slate-900">Help center</p>
            <p className="mt-2 text-sm text-slate-600">Find guides and FAQs about installation and billing.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="font-semibold text-slate-900">Live chat</p>
            <p className="mt-2 text-sm text-slate-600">Start a conversation with our support agents.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="font-semibold text-slate-900">System status</p>
            <p className="mt-2 text-sm text-slate-600">View planned maintenance and outages.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
