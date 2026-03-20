import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Plans', to: '/plans' },
  { label: 'Services', to: '/services' },
  { label: 'Coverage', to: '/coverage' },
  { label: 'Support', to: '/support' },
  { label: 'Contact', to: '/contact' },
]

export default function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  
  const user = JSON.parse(localStorage.getItem('skdn_user') || 'null')
  const token = localStorage.getItem('skdn_token')

  const handleLogout = () => {
    localStorage.removeItem('skdn_user')
    localStorage.removeItem('skdn_token')
    setIsProfileOpen(false)
    navigate('/login')
  }

  const goToDashboard = () => {
    navigate('/dashboard')
    setIsProfileOpen(false)
  }

  const goToAdminDashboard = () => {
    navigate('/admin')
    setIsProfileOpen(false)
  }

  return (
    <header className="bg-white/80 backdrop-blur border-b border-slate-200 sticky top-0 z-30">
      <div className="container flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2 text-brand-600 font-semibold text-lg">
          <img src="/src/assets/SDN initials.png" alt="SKY DOT NETWORKS" className="h-10 w-10 rounded-xl" />
          <span className="hidden sm:inline">SKY DOT NETWORKS</span>
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
          {token && user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="inline-flex items-center justify-center rounded-full bg-brand-600 w-10 h-10 text-white font-bold text-lg hover:bg-brand-700 transition"
              >
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-50">
                  <div className="p-4 border-b border-slate-200">
                    <p className="font-medium text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                  <div className="p-2">
                    {user.role !== 'ADMIN' && (
                      <button
                        onClick={goToDashboard}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded mb-1"
                      >
                        📊 Dashboard
                      </button>
                    )}
                    {user.role === 'ADMIN' && (
                      <button
                        onClick={goToAdminDashboard}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded mb-1"
                      >
                        🛠️ Admin Dashboard
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                    >
                      🚪 Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden sm:inline-flex px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-brand-500/20 hover:bg-brand-700"
              >
                Sign up
              </Link>
            </>
          )}

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            Menu
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/90">
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
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            {!token && (
              <>
                <Link
                  to="/login"
                  className="mt-2 block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="mt-2 inline-flex items-center justify-center rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white shadow-sm shadow-brand-500/20 hover:bg-brand-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
