export default function Footer() {
  return (
    <footer className="bg-white/80 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-3">
        <div>
          <h3 className="text-base font-semibold text-gray-900">JEVI-TECH COMM LTD</h3>
          <p className="mt-2 text-sm text-gray-600">Fast Internet for Kiambu</p>
          <div className="mt-4 space-y-1 text-sm text-gray-600">
            <p>
              <span className="font-semibold text-gray-900">Phone:</span> +254 720 593 380
            </p>
            <p>
              <span className="font-semibold text-gray-900">Email:</span> fusedlens@gmail.com
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-900">Coverage Areas</h4>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li>Kiambu Town</li>
            <li>Kirigiti</li>
            <li>Riabai</li>
            <li>Mugumo</li>
            <li>Ndumberi</li>
            <li>Kanunga</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-900">Quick links</h4>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li><a href="/plans" className="hover:text-gray-900">Plans</a></li>
            <li><a href="/coverage" className="hover:text-gray-900">Coverage</a></li>
            <li><a href="/contact" className="hover:text-gray-900">Contact</a></li>
            <li><a href="/login" className="hover:text-gray-900">Sign in</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-between gap-4 text-sm text-gray-500 md:flex-row">
          <p>© {new Date().getFullYear()} JEVI-TECH COMM LTD. All rights reserved.</p>
          <p className="text-xs">Built with Next.js + Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  )
}
