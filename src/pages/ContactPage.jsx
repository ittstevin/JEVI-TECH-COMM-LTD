import { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [status, setStatus] = useState({ type: '', message: '' })

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setStatus({ type: 'success', message: 'Thank you! We will be in touch soon.' })
    setForm({ name: '', email: '', phone: '', message: '' })
  }

  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-white/80 p-8 shadow-soft">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Contact</h1>
            <p className="mt-2 max-w-xl text-sm text-slate-600">
              Reach out to JEVI-TECH COMM LTD for questions, installation scheduling, or account
              support. We’re here to help you stay connected.
            </p>

            <div className="mt-8 space-y-6">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Phone</h2>
                <p className="mt-1 text-sm text-slate-600">+254 720 593 380</p>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Email</h2>
                <p className="mt-1 text-sm text-slate-600">fusedlens@gmail.com</p>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Location</h2>
                <p className="mt-1 text-sm text-slate-600">Kirigiti, Kiambu Town, Kenya</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8">
            <h2 className="text-xl font-semibold text-slate-900">Send us a message</h2>
            <p className="mt-2 text-sm text-slate-600">Fill out the form below and we’ll get back to you within 24 hours.</p>

            {status.message ? (
              <div
                className={`mt-6 rounded-xl px-4 py-3 text-sm font-medium ${
                  status.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    : 'bg-rose-50 text-rose-700 border border-rose-100'
                }`}
              >
                {status.message}
              </div>
            ) : null}

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="text-sm font-semibold text-slate-700">Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">Phone</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  required
                  className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
              >
                Send message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
