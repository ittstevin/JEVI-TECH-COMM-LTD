'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState({ type: '', message: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus({ type: 'success', message: 'Thanks! We will be in touch shortly.' })
    setForm({ name: '', email: '', phone: '', message: '' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-white">
      <nav className="bg-white shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-brand-600">
                JEVI-TECH COMM LTD
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/plans" className="text-gray-700 hover:text-brand-600">
                Plans
              </Link>
              <Link href="/coverage" className="text-gray-700 hover:text-brand-600">
                Coverage
              </Link>
              <Link href="/contact" className="text-gray-900 font-medium">
                Contact
              </Link>
              <Link href="/login" className="btn-primary">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid gap-10 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
            <p className="text-lg text-gray-600 mb-6">
              Reach out to JEVI-TECH COMM LTD for questions, installations, and support.
            </p>
            <div className="space-y-6 text-sm text-gray-600">
              <div>
                <p className="font-semibold text-gray-900">Phone</p>
                <p>+254 720 593 380</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Email</p>
                <p>fusedlens@gmail.com</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Location</p>
                <p>Kirigiti, Kiambu Town, Kenya</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-10 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Send us a message</h2>
            <p className="text-sm text-gray-600 mb-6">
              Fill out the form and our team will respond within 24 hours.
            </p>

            {status.message && (
              <div
                className={`mb-6 rounded-xl px-4 py-3 text-sm font-medium ${
                  status.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    : 'bg-rose-50 text-rose-700 border border-rose-100'
                }`}
              >
                {status.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">Phone</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  required
                  className="mt-2 w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
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
