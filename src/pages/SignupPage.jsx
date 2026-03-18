import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getPlanById } from '../services/plans'
import { setUser } from '../services/user'

export default function SignupPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const defaultPlanId = searchParams.get('plan')
  const selectedPlan = useMemo(() => getPlanById(defaultPlanId), [defaultPlanId])

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    plan: selectedPlan.id,
  })
  const [submitted, setSubmitted] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setUser({
      profile: {
        name: form.fullName,
        phone: form.phone,
        email: form.email,
        address: form.address,
      },
      subscription: {
        planId: form.plan,
        startedAt: Date.now(),
        nextBilling: Date.now() + 30 * 24 * 60 * 60 * 1000,
      },
      payments: [],
    })
    setSubmitted(true)
    setTimeout(() => {
      navigate('/dashboard')
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl">
        <div className="rounded-3xl bg-white/95 backdrop-blur p-8 shadow-2xl mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Create Your Account</h1>
        <p className="mt-2 text-sm text-slate-600">
          Fill in your details and we’ll get your connection up and running.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6 rounded-3xl bg-white/95 backdrop-blur p-8 shadow-2xl">
            <h2 className="text-lg font-semibold text-slate-900">Your Information</h2>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
            <input
              required
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                placeholder="Jane Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
            <input
              required
              name="phone"
              value={form.phone}
              onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                placeholder="+254 712 345 678"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
            <input
              required
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Address</label>
            <input
              required
              name="address"
              value={form.address}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              placeholder="123 Somewhere Ave, Somewhere"
            />
          </div>
        </div>

        <div className="space-y-6 rounded-3xl bg-white/80 p-8 shadow-soft">
          <h2 className="text-lg font-semibold text-slate-900">Selected plan</h2>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-700">{selectedPlan.name}</p>
            <p className="mt-1 text-sm text-slate-600">{selectedPlan.speed} Mbps</p>
            <p className="mt-3 text-2xl font-semibold text-slate-900">{selectedPlan.price} / month</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {selectedPlan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                    ✓
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-brand-500/30 hover:bg-brand-700"
            disabled={submitted}
          >
            {submitted ? 'Setting up your account…' : 'Create account'}
          </button>

          {submitted ? (
            <p className="text-sm text-emerald-700">
              Success! Redirecting you to your dashboard…
            </p>
          ) : (
            <p className="text-sm text-slate-600">
              You can change your plan and billing preferences from your dashboard.
            </p>
          )}
        </div>
      </form>
    </div>
  )
}
