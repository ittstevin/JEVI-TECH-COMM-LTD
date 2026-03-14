'use client'

import Link from 'next/link'
import Button from '@/components/Button'
import Card from '@/components/Card'
import { formatSpeed } from '@/utils/format'

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    speed: 10,
    price: 'KES 1,500',
    description: 'Ideal for browsing and small households.',
    features: ['Unlimited data', 'Standard support', 'Easy setup'],
  },
  {
    id: 'standard',
    name: 'Standard',
    speed: 20,
    price: 'KES 2,000',
    description: 'Good for streaming and everyday use.',
    features: ['Unlimited data', 'Priority support', 'Reliable performance'],
  },
  {
    id: 'premium',
    name: 'Premium',
    speed: 50,
    price: 'KES 3,000',
    description: 'Great for gaming, remote work, and families.',
    features: ['Unlimited data', 'High performance', 'Priority support'],
  },
  {
    id: 'business',
    name: 'Business',
    speed: 100,
    price: 'KES 7,000',
    description: 'Ultra-fast internet for businesses and heavy users.',
    features: ['Unlimited data', 'Dedicated support', 'Service-level guarantees'],
  },
]

export default function PlansPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-brand-600">
                JTC Internet
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/plans" className="text-gray-900 font-medium">
                Plans
              </Link>
              <Link href="/coverage" className="text-gray-700 hover:text-brand-600">
                Coverage
              </Link>
              <Link href="/support" className="text-gray-700 hover:text-brand-600">
                Support
              </Link>
              <Link href="/login" className="btn-primary">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select the internet plan that best fits your needs. All plans include unlimited data and 24/7 support.
          </p>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {plans.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-600 text-lg">No plans available at the moment.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {plans.map((plan) => (
                <Card key={plan.id} className="relative">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-4">{plan.description}</p>
                    <div className="text-4xl font-bold text-brand-600 mb-2">
                      {plan.price}
                      <span className="text-lg font-normal text-gray-600">/month</span>
                    </div>
                    <div className="text-lg text-gray-700 font-medium">
                      {formatSpeed(plan.speed)}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">What's included:</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-gray-600">
                          <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button className="w-full" onClick={() => window.location.href = `/signup?plan=${plan.id}`}>
                    Choose Plan
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a contract or setup fee?
              </h3>
              <p className="text-gray-600">
                No contracts required! All plans are month-to-month with no setup fees.
              </p>
            </Card>
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What if I'm not satisfied with my service?
              </h3>
              <p className="text-gray-600">
                We offer a 30-day money-back guarantee. If you're not happy, we'll refund your payment.
              </p>
            </Card>
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you offer installation services?
              </h3>
              <p className="text-gray-600">
                Yes! Professional installation is available for $99, or you can choose self-installation for free.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-brand-100 mb-8 text-lg">
            Questions about our plans? Our team is here to help you choose the right one.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="bg-white text-brand-600 hover:bg-gray-50 font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
              Sign Up Now
            </Link>
            <Link href="/support" className="border-2 border-white text-white hover:bg-white hover:text-brand-600 font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}