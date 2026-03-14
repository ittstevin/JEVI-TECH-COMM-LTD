import { NavLink, Link } from 'react-router-dom'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Plans', to: '/plans' },
  { label: 'Coverage', to: '/coverage' },
  { label: 'Contact', to: '/contact' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Support', to: '/support' },
  { label: 'Status', to: '/status' },
]

export default function Navbar() {
  return (
    <header className="bg-white/80 backdrop-blur border-b border-slate-200 sticky top-0 z-30">
      <div className="container flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2 text-brand-600 font-semibold text-lg">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-700">
            JTC
          </span>
          <span className="hidden sm:inline">JEVI-TECH COMM LTD</span>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/signup"
            className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-brand-500/20 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            Sign up
          </Link>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 md:hidden"
            onClick={() => {
              const nav = document.getElementById('mobile-nav')
              nav?.classList.toggle('hidden')
            }}
          >
            Menu
          </button>
        </div>
      </div>

      <div id="mobile-nav" className="md:hidden hidden border-t border-slate-200 bg-white/90">
        <div className="container flex flex-col gap-1 py-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100'
                }`
              }
              onClick={() => document.getElementById('mobile-nav')?.classList.add('hidden')}
            >
              {item.label}
            </NavLink>
          ))}
          <Link
            to="/signup"
            className="mt-2 inline-flex items-center justify-center rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white shadow-sm shadow-brand-500/20 hover:bg-brand-700"
            onClick={() => document.getElementById('mobile-nav')?.classList.add('hidden')}
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  )
}
