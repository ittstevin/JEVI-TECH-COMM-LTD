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

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResult, setSearchResult] = useState(null)

  const handleSearch = (e) => {
    e.preventDefault()
    const query = searchQuery.trim().toLowerCase()
    
    if (!query) {
      setSearchResult(null)
      return
    }

    const found = coverageAreas.some(area => area.toLowerCase() === query)
    setSearchResult({
      query: searchQuery,
      found: found
    })
  }

  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-white/80 p-8 shadow-soft">
        <h1 className="text-3xl font-semibold text-slate-900">Coverage</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          We proudly serve homes and businesses across Kiambu.
        </p>

        {/* Search Bar */}
        <div className="mt-8 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search your location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-brand-600 px-4 py-2 text-white hover:bg-brand-700 transition"
              >
                Search
              </button>
            </div>
          </form>

          {/* Search Result */}
          {searchResult && (
            <div className={`mt-4 rounded-lg p-4 ${searchResult.found ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
              {searchResult.found ? (
                <p className="text-green-800 font-medium">
                  ✓ Great news! We serve <strong>{searchResult.query}</strong>. Get connected today!
                </p>
              ) : (
                <p className="text-amber-800 font-medium">
                  We are not yet located in <strong>{searchResult.query}</strong>. We're expanding soon! Stay tuned.
                </p>
              )}
            </div>
          )}
        </div>

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
