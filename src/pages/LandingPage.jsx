import { Link } from 'react-router-dom'
import SpeedIndicator from '../components/SpeedIndicator'

const testimonials = [
  {
    name: 'Jordan M.',
    quote: 'The speed is insane — my home office runs without a hiccup. Support replies within minutes.',
  },
  {
    name: 'Alejandra R.',
    quote: 'Setup was easy, and I love the fact that I can stream and game at the same time with zero lag.',
  },
  {
    name: 'Samir K.',
    quote: 'Stable connection day in and day out. I never worry about outages anymore.',
  },
]

export default function LandingPage() {
  return (
    <div className="space-y-16">
      <section className="rounded-3xl bg-white/80 p-8 shadow-soft">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <p className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">
              Fast. Reliable. Everywhere.
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Fast & Reliable Internet in Kiambu
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-slate-600">
              JEVI-TECH COMM LTD provides high-speed internet to homes and businesses in Kiambu Town, Kirigiti, Riabai,
              Mugumo, Ndumberi, and Kanunga.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="/plans"
                className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-brand-500/30 hover:bg-brand-700"
              >
                View Plans
              </Link>
              <Link
                to="/coverage"
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
              >
                Check Coverage
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
              >
                Get Connected
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="w-full max-w-md rounded-3xl bg-slate-900/5 p-8">
              <SpeedIndicator base={300} variance={220} />
            </div>
            <div className="grid w-full grid-cols-2 gap-4">
              <div className="rounded-2xl bg-brand-50 p-4 text-center">
                <p className="text-2xl font-semibold text-brand-700">99.9%</p>
                <p className="text-sm text-slate-600">Uptime</p>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-4 text-center">
                <p className="text-2xl font-semibold text-emerald-700">24/7</p>
                <p className="text-sm text-slate-600">Support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-white/80 p-8 shadow-soft">
        <h2 className="text-2xl font-semibold text-slate-900">What you get</h2>
        <p className="mt-2 max-w-2xl text-slate-600">
          Choose a plan designed for your home or business and enjoy a fast, consistent
          experience everywhere.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="card">
            <h3 className="text-lg font-semibold text-slate-900">Fast speeds</h3>
            <p className="mt-2 text-sm text-slate-600">
              Gigabit-ready connections and optimized routing make buffering a thing of the past.
            </p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold text-slate-900">Reliable connection</h3>
            <p className="mt-2 text-sm text-slate-600">
              99.9% uptime with automatic failover and constant monitoring across the network.
            </p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold text-slate-900">24/7 support</h3>
            <p className="mt-2 text-sm text-slate-600">
              Reach our support team any time via chat, email, or phone. We're here when you need us.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-white/80 p-8 shadow-soft">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">What our customers say</h2>
            <p className="mt-2 max-w-xl text-sm text-slate-600">
              Real feedback from real people using our service.
            </p>
          </div>
          <Link
            to="/support"
            className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            Visit support center
          </Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="card">
              <p className="text-sm text-slate-600">“{testimonial.quote}”</p>
              <p className="mt-4 text-sm font-semibold text-slate-900">{testimonial.name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
