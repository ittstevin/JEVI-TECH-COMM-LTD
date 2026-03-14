'use client'

import Link from 'next/link'

const coverageAreas = [
  'Kiambu Town',
  'Kirigiti',
  'Riabai',
  'Mugumo',
  'Ndumberi',
  'Kanunga',
]

export default function CoveragePage() {
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
              <Link href="/coverage" className="text-gray-900 font-medium">
                Coverage
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-brand-600">
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
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Coverage Areas</h1>
          <p className="text-lg text-gray-600 mb-8">
            We proudly serve homes and businesses across Kiambu.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {coverageAreas.map((area) => (
              <div key={area} className="rounded-2xl border border-gray-200 bg-white p-6 text-center">
                <h2 className="text-xl font-semibold text-gray-900">{area}</h2>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Want to confirm service at your address?</h2>
          <p className="text-lg text-gray-600">
            Contact us and our team will help you check availability in your neighborhood.
          </p>
          <Link href="/contact" className="mt-8 inline-flex items-center justify-center rounded-lg bg-brand-600 px-8 py-3 text-lg font-semibold text-white shadow-sm hover:bg-brand-700">
            Get Connected
          </Link>
        </div>
      </section>
    </div>
  )
}
