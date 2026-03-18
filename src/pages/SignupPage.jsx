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
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
              placeholder="you@example.com"
            />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Address</label>
            <input
              required
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
              placeholder="123 Somewhere Ave, Somewhere"
            />
            </div>
        </div>

        <div className="space-y-6 rounded-3xl bg-white/95 backdrop-blur p-8 shadow-2xl">
          <h2 className="text-lg font-semibold text-slate-900">Selected Plan</h2>
          <div className="rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-blue-50 p-6">
            <p className="text-2xl font-bold text-slate-900">{selectedPlan.name}</p>
            <p className="mt-2 text-lg text-brand-600 font-semibold">{selectedPlan.speed} Mbps</p>
            <p className="mt-4 text-3xl font-bold text-slate-900">KES {selectedPlan.price}<span className="text-lg text-slate-600 font-normal"> / month</span></p>
            <ul className="mt-6 space-y-3">
              {selectedPlan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-white text-sm flex-shrink-0">
                    ✓
                  </span>
                  <span className="text-slate-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-brand-600 to-brand-700 text-white py-3 rounded-xl font-semibold hover:from-brand-700 hover:to-brand-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            disabled={submitted}
          >
            {submitted ? 'Setting up your account…' : 'Create Account'}
          </button>

          {submitted ? (
            <p className="text-center text-emerald-600 font-medium">
              ✓ Success! Redirecting you to your dashboard…
            </p>
          ) : (
            <p className="text-center text-slate-600 text-sm">
              You can change your plan and billing preferences from your dashboard.
            </p>
          )}
        </div>
      </form>
    </div>
  )
}
