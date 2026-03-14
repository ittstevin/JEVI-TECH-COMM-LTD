import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-white/80 backdrop-blur border-t border-slate-200">
      <div className="container grid gap-8 py-10 md:grid-cols-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">JEVI-TECH COMM LTD</h3>
          <p className="mt-2 text-sm text-slate-600">Fast Internet for Kiambu</p>
          <div className="mt-4 space-y-1 text-sm text-slate-600">
            <p>
              <span className="font-semibold text-slate-900">Phone:</span> +254 720 593 380
            </p>
            <p>
              <span className="font-semibold text-slate-900">Email:</span> fusedlens@gmail.com
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-900">Coverage Areas</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>Kiambu Town</li>
            <li>Kirigiti</li>
            <li>Riabai</li>
            <li>Mugumo</li>
            <li>Ndumberi</li>
            <li>Kanunga</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-900">Quick Links</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>
              <Link to="/plans" className="hover:text-slate-900">
                Plans
              </Link>
            </li>
            <li>
              <Link to="/coverage" className="hover:text-slate-900">
                Coverage
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-slate-900">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200 py-6">
        <div className="container flex flex-col items-center justify-between gap-4 text-sm text-slate-500 md:flex-row">
          <p>© {new Date().getFullYear()} JEVI-TECH COMM LTD. All rights reserved.</p>
          <p className="text-xs">
            Built with React + Tailwind.
          </p>
        </div>
      </div>
    </footer>
  )
}
