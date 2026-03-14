import Link from 'next/link'

export default function Home() {
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
              <Link href="/plans" className="text-gray-700 hover:text-brand-600">
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

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Fast & Reliable Internet in Kiambu
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            JEVI-TECH COMM LTD provides high-speed internet to homes and businesses in Kiambu Town, Kirigiti, Riabai, Mugumo, Ndumberi, and Kanunga.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/plans" className="btn-primary text-lg px-8 py-3">
              View Plans
            </Link>
            <Link href="/coverage" className="btn-secondary text-lg px-8 py-3">
              Check Coverage
            </Link>
            <Link href="/signup" className="btn-secondary text-lg px-8 py-3">
              Get Connected
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose JTC Internet?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide exceptional internet services with cutting-edge technology and unparalleled customer support.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-gray-600">
                Experience blazing speeds up to 1Gbps with our fiber optic network.
              </p>
            </div>
            <div className="card text-center">
              <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">99.9% Uptime</h3>
              <p className="text-gray-600">
                Reliable connectivity you can count on with our redundant infrastructure.
              </p>
            </div>
            <div className="card text-center">
              <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">
                Our expert support team is always ready to help you with any issues.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Connected?
          </h2>
          <p className="text-brand-100 mb-8 text-lg">
            Join thousands of satisfied customers enjoying fast, reliable internet service.
          </p>
          <Link href="/signup" className="bg-white text-brand-600 hover:bg-gray-50 font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
            Sign Up Today
          </Link>
        </div>
      </section>
    </div>
  )
}