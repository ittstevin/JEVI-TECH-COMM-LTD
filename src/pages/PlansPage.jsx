import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import PlanCard from '../components/PlanCard'
import { plans } from '../services/plans'
import { authHelpers } from '../lib/authHelpers'

export default function PlansPage() {
  const navigate = useNavigate()
  const popularPlan = useMemo(() => plans.find((plan) => plan.bestValue) ?? plans[0], [])

  function handleSubscribe(plan) {
    const currentUser = authHelpers.getCurrentUser()
    
    if (currentUser) {
      // User is already logged in, go to payment page
      navigate(`/payment?plan=${encodeURIComponent(plan.id)}`)
    } else {
      // User is not logged in, go to signup page
      navigate(`/signup?plan=${encodeURIComponent(plan.id)}`)
    }
  }

  return (
    <div className="space-y-10">
      <header className="rounded-3xl bg-white/80 p-8 shadow-soft">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Internet plans in Kiambu</h1>
            <p className="mt-2 text-sm text-slate-600">
              Choose the right plan for your home or business. All plans include unlimited data,
              reliable service, and local support.
            </p>
          </div>
          <div className="rounded-2xl bg-brand-50 px-5 py-4 text-sm font-semibold text-brand-700">
            Most popular: {popularPlan.name} ({popularPlan.speed} Mbps)
          </div>
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            highlight={plan.id === popularPlan.id}
            onSubscribe={handleSubscribe}
          />
        ))}
      </section>

      <section className="rounded-3xl bg-white/80 p-8 shadow-soft">
        <h2 className="text-2xl font-semibold text-slate-900">Need help choosing?</h2>
        <p className="mt-2 text-sm text-slate-600">
          Our support team can help recommend the best plan based on how many devices you have
          and what you like to do online.
        </p>
      </section>
    </div>
  )
}
