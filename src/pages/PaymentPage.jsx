import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { addPayment, getPaymentHistory, getUser } from '../services/user'
import { getPlanById } from '../services/plans'
import { formatCurrency, formatDate } from '../utils/format'

const paymentMethods = [
  { id: 'card', label: 'Credit / Debit Card' },
  { id: 'mpesa', label: 'M-Pesa' },
]

export default function PaymentPage() {
  const [searchParams] = useSearchParams()
  const user = getUser()
  
  // Check if a plan was passed via query params, otherwise use user's current plan
  const planFromParams = searchParams.get('plan')
  const plan = useMemo(() => {
    if (planFromParams) {
      return getPlanById(planFromParams)
    }
    return getPlanById(user?.subscription?.planId)
  }, [planFromParams, user])
  
  const [method, setMethod] = useState(paymentMethods[0].id)
  const [isPaying, setIsPaying] = useState(false)
  const [history, setHistory] = useState(getPaymentHistory())

  const amount = useMemo(() => {
    if (!plan) return 0
    const numeric = Number(plan.price.replace(/[^\d]/g, ''))
    return Number.isFinite(numeric) ? numeric : 0
  }, [plan])

  function handlePay() {
    if (!plan) return
    setIsPaying(true)
    const entry = {
      id: `${Date.now()}`,
      method,
      amount,
      status: 'Completed',
      date: new Date().toISOString(),
    }

    window.setTimeout(() => {
      const updated = addPayment(entry)
      setHistory(updated)
      setIsPaying(false)
    }, 1000)
  }

  return (
    <div className="space-y-10">
      <header className="rounded-3xl bg-white/80 p-8 shadow-soft">
        <h1 className="text-3xl font-semibold text-slate-900">Payment</h1>
        <p className="mt-2 text-sm text-slate-600">
          Make a payment for your internet plan or review recent payment history.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl bg-white/80 p-8 shadow-soft">
          <h2 className="text-xl font-semibold text-slate-900">Pay now</h2>
          <p className="mt-2 text-sm text-slate-600">
            Your current plan: <span className="font-semibold">{plan?.name ?? 'None'}</span>
          </p>
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-700">Amount due</p>
              <p className="mt-1 text-3xl font-semibold text-slate-900">{formatCurrency(amount)}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-700">Payment method</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {paymentMethods.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                      method === option.id
                        ? 'border-brand-300 bg-brand-50 text-brand-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                    onClick={() => setMethod(option.id)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handlePay}
              disabled={isPaying}
              className="w-full rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-brand-500/30 hover:bg-brand-700"
            >
              {isPaying ? 'Processing…' : `Pay ${formatCurrency(amount)}`}
            </button>
          </div>
        </section>

        <section className="rounded-3xl bg-white/80 p-8 shadow-soft">
          <h2 className="text-xl font-semibold text-slate-900">Payment history</h2>
          <p className="mt-2 text-sm text-slate-600">
            Your recent payments are stored locally in the browser for this demo.
          </p>

          <div className="mt-6 space-y-4">
            {history.length === 0 ? (
              <p className="text-sm text-slate-600">No payments found yet.</p>
            ) : (
              <ul className="space-y-3">
                {history
                  .slice()
                  .reverse()
                  .map((entry) => (
                    <li
                      key={entry.id}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-4"
                    >
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {formatCurrency(entry.amount)}
                          </p>
                          <p className="text-xs text-slate-500">{entry.method.toUpperCase()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-500">{formatDate(entry.date)}</p>
                          <p className="text-xs font-semibold text-emerald-700">
                            {entry.status}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
