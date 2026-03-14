import { useState } from 'react'
import { checkCoverage } from '../services/coverage'

export default function CoveragePage() {
  const coverageAreas = [
    'Kiambu Town',
    'Kirigiti',
    'Riabai',
    'Mugumo',
    'Ndumberi',
    'Kanunga',
  ]

  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-white/80 p-8 shadow-soft">
        <h1 className="text-3xl font-semibold text-slate-900">Coverage</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          We proudly serve homes and businesses across Kiambu.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coverageAreas.map((area) => (
            <div key={area} className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-5 text-center">
              <h3 className="text-lg font-semibold text-slate-900">{area}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-white/80 p-8 shadow-soft">
        <h2 className="text-2xl font-semibold text-slate-900">Want to confirm service at your address?</h2>
        <p className="mt-2 text-sm text-slate-600">
          Reach out and our team will let you know if we can connect your home or business in your neighborhood.
        </p>
      </section>
    </div>
  )
}
