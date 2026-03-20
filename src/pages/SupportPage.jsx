import { useState, useEffect } from 'react'
import { firestoreHelpers } from '../lib/firestoreHelpers'

const faqs = [
  {
    question: 'How do I set up my router?',
    answer:
      'Plug in your router, open the setup page, and follow the on-screen steps. If you need help, our support team can walk you through it.',
  },
  {
    question: 'What should I do if my connection is slow?',
    answer:
      'Try restarting your router and checking for outages on our status page. If the problem persists, contact our support team for troubleshooting.',
  },
  {
    question: 'How do I change my plan?',
    answer:
      'You can change your plan any time from your dashboard. If you need help choosing the right plan, we can guide you.',
  },
]

const cannedResponses = [
  'Hi there! How can I help you today?',
  'Could you share your account email so I can look up your information?',
  'We are checking your service area now; this should only take a moment.',
  'Thanks for waiting! Everything looks good on our end.',
  'You can also check the Network Status page for outage updates.',
]

export default function SupportPage() {
  const [activeFaq, setActiveFaq] = useState(null)
  const [messages, setMessages] = useState([
    { from: 'agent', text: 'Welcome! Ask me anything about your service.' },
  ])
  const [draft, setDraft] = useState('')

  const [serviceStatus, setServiceStatus] = useState([])
  const [statusLoading, setStatusLoading] = useState(true)
  const [statusError, setStatusError] = useState('')

  useEffect(() => {
    const load = async () => {
      setStatusLoading(true)
      setStatusError('')
      const { data, error } = await firestoreHelpers.getCollection('serviceStatus')
      if (error) {
        setStatusError(error)
        setServiceStatus([])
      } else {
        setServiceStatus(data || [])
      }
      setStatusLoading(false)
    }

    load().catch((err) => {
      setStatusError(err.message || 'Unable to load service status')
      setStatusLoading(false)
    })
  }, [])

  function sendMessage() {
    if (!draft.trim()) return
    const userMessage = { from: 'user', text: draft.trim() }
    setMessages((prev) => [...prev, userMessage])
    setDraft('')

    window.setTimeout(() => {
      const response = cannedResponses[Math.floor(Math.random() * cannedResponses.length)]
      setMessages((prev) => [...prev, { from: 'agent', text: response }])
    }, 600)
  }

  return (
    <div className="space-y-10">
      <header className="rounded-3xl bg-white/80 p-8 shadow-soft">
        <h1 className="text-3xl font-semibold text-slate-900">Support</h1>
        <p className="mt-2 text-sm text-slate-600">
          Browse FAQs, submit a request, or chat with our support bot in real time.
        </p>
      </header>

      <section className="rounded-3xl bg-white/80 p-8 shadow-soft">
        <h2 className="text-xl font-semibold text-slate-900">Network Status</h2>
        {statusLoading ? (
          <p className="mt-3 text-sm text-slate-600">Loading current service status...</p>
        ) : statusError ? (
          <p className="mt-3 text-sm text-red-600">Error loading service status: {statusError}</p>
        ) : serviceStatus.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600">No service status data available.</p>
        ) : (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {serviceStatus.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-slate-900">{item.name}</h3>
                  <span
                    className={`text-xs font-semibold uppercase px-2 py-1 rounded ${
                      item.status === 'ok' ? 'bg-emerald-100 text-emerald-700' :
                      item.status === 'degraded' ? 'bg-amber-100 text-amber-700' :
                      item.status === 'down' ? 'bg-rose-100 text-rose-700' :
                      'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {item.status || 'unknown'}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{item.note || 'No details provided.'}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-3xl bg-white/80 p-8 shadow-soft lg:col-span-2">
          <h2 className="text-xl font-semibold text-slate-900">Frequently asked questions</h2>
          <div className="mt-6 space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = idx === activeFaq
              return (
                <div key={faq.question} className="rounded-2xl border border-slate-200">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                  >
                    <span className="text-sm font-semibold text-slate-900">{faq.question}</span>
                    <span className="text-sm text-slate-500">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen ? (
                    <div className="border-t border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
                      {faq.answer}
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>

          <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-slate-900">Need to reach us?</h3>
            <p className="mt-2 text-sm text-slate-600">
              For direct messages, go to the Contact page where you can submit a ticket and track responses.
            </p>
            <a
              href="/contact"
              className="inline-block mt-4 rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
            >
              Go to Contact Page
            </a>
          </div>
        </section>

        <section className="rounded-3xl bg-white/80 p-8 shadow-soft">
          <h2 className="text-xl font-semibold text-slate-900">Live chat</h2>
          <div className="mt-4 flex h-[420px] flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex-1 space-y-3 overflow-y-auto pr-2">
              {messages.map((msg, idx) => (
                <div
                  key={`${msg.from}-${idx}`}
                  className={`flex ${msg.from === 'agent' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                      msg.from === 'agent'
                        ? 'bg-white text-slate-800 shadow-sm'
                        : 'bg-brand-600 text-white'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                placeholder="Type a message..."
              />
              <button
                type="button"
                onClick={sendMessage}
                className="rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
              >
                Send
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
