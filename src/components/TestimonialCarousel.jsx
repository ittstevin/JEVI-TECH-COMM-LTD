import { useEffect, useState } from 'react'

export default function TestimonialCarousel() {
  const [testimonials, setTestimonials] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/testimonials')
      const data = await response.json()
      setTestimonials(data.testimonials || [])
    } catch (error) {
      console.error('Error fetching testimonials:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading testimonials...</div>
  }

  if (testimonials.length === 0) {
    return null
  }

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const current = testimonials[currentIndex]

  return (
    <section className="bg-gradient-to-r from-brand-50 to-brand-100 py-16">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>

        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 border-l-4 border-brand-500">
          <div className="flex items-start gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <span key={i} className="text-yellow-400">
                ⭐
              </span>
            ))}
          </div>

          <p className="text-lg text-slate-700 mb-6 italic">"{current.message}"</p>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900">{current.user.name}</p>
              <p className="text-sm text-slate-500">
                {new Date(current.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={prevTestimonial}
                className="p-2 rounded-full border border-slate-200 hover:bg-slate-100 transition"
              >
                ←
              </button>
              <button
                onClick={nextTestimonial}
                className="p-2 rounded-full border border-slate-200 hover:bg-slate-100 transition"
              >
                →
              </button>
            </div>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2 rounded-full transition ${
                  i === currentIndex ? 'bg-brand-500 w-8' : 'bg-slate-300 w-2'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
