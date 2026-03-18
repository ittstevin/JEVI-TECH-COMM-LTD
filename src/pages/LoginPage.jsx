import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      
      const data = await response.json()
      if (response.ok) {
        localStorage.setItem('skdn_token', data.token)
        localStorage.setItem('skdn_user', JSON.stringify(data.user))
        setStatus({ type: 'success', message: '✅ Login successful!' })
        setTimeout(() => navigate(data.user.role === 'ADMIN' ? '/admin' : '/dashboard'), 1000)
      } else {
        setStatus({ type: 'error', message: `❌ ${data.error || 'Login failed'}` })
      }
    } catch (error) {
      setStatus({ type: 'error', message: '❌ Connection error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-brand-600 to-brand-700 flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Login</h1>
        <p className="text-slate-600 mb-6">Access your SKY DOT NETWORKS account</p>

        {status.message && (
          <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${
            status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-600 text-white py-2 rounded-lg font-semibold hover:bg-brand-700 transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-slate-600 text-sm mt-6">
          Don't have an account? <Link to="/signup" className="text-brand-600 font-semibold hover:underline">Sign up</Link>
        </p>

        <div className="mt-6 p-4 bg-slate-50 rounded-lg text-xs text-slate-600">
          <p className="font-semibold mb-2">🔐 Demo Credentials:</p>
          <p>Email: admin@jevitech.co.ke</p>
          <p>Password: [Use your admin password]</p>
        </div>
      </div>
    </div>
  )
}
