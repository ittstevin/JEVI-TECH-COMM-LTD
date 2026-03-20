import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authHelpers } from '../lib/authHelpers'
import { firestoreHelpers } from '../lib/firestoreHelpers'
import { setUser } from '../services/user'

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
      const { user, error } = await authHelpers.login(form.email, form.password)
      if (error) {
        setStatus({ type: 'error', message: `❌ ${error}` })
      } else {
        let profile = null

        // Get user profile from Firestore
        const { data: userProfile, error: profileError } = await firestoreHelpers.getDocument('users', user.uid)

        if (profileError) {
          if (profileError.includes('Missing or insufficient permissions') || profileError.includes('missing or insufficient permissions')) {
            // Permissions rule is preventing Firestore writes/reads; fall back to in-memory profile with no write attempt
            profile = {
              role: (user.email === 'admin@jevitech.co.ke' || user.email === 'admin@sky-dot-networks.com' || user.email.includes('admin')) ? 'ADMIN' : 'CUSTOMER',
              name: user.displayName || user.email.split('@')[0],
              email: user.email,
              verified: user.emailVerified,
            }
          } else if (profileError === 'Document not found') {
            profile = {
              role: (user.email === 'admin@jevitech.co.ke' || user.email === 'admin@sky-dot-networks.com' || user.email.includes('admin')) ? 'ADMIN' : 'CUSTOMER',
              name: user.displayName || user.email.split('@')[0],
              email: user.email,
              verified: user.emailVerified,
            }
            // It's okay for this to fail because it is not required for login
            firestoreHelpers.setDocument('users', user.uid, profile).catch(() => {})
          } else {
            throw new Error(profileError)
          }
        } else {
          profile = userProfile
        }

        if (!profile) {
          profile = {
            role: (user.email === 'admin@jevitech.co.ke' || user.email === 'admin@sky-dot-networks.com' || user.email.includes('admin')) ? 'ADMIN' : 'CUSTOMER',
            name: user.displayName || user.email.split('@')[0],
            email: user.email,
            verified: user.emailVerified,
          }
        }

        // Get ID token
        const token = await authHelpers.getIdToken()

        // Save to localStorage and user state
        localStorage.setItem('skdn_token', token)
        localStorage.setItem('skdn_user', JSON.stringify({ uid: user.uid, ...profile }))
        setUser({ uid: user.uid, ...profile })

        setStatus({ type: 'success', message: '✅ Login successful!' })
        
        // Navigate immediately based on role
        if (profile?.role === 'ADMIN') {
          navigate('/admin')
        } else {
          navigate('/dashboard')
        }
      }
    } catch (error) {
      setStatus({ type: 'error', message: `❌ ${error.message || 'Login failed. Please try again.'}` })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-brand-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-brand-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl max-w-md w-full p-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Welcome Back</h1>
          <p className="text-slate-600">Access your SKY DOT NETWORKS account</p>
        </div>

        {status.message && (
          <div className={`mb-6 p-4 rounded-xl text-sm font-medium transition-all duration-300 ${
            status.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all duration-200"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-brand-600 to-brand-700 text-white py-3 rounded-xl font-semibold hover:from-brand-700 hover:to-brand-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-200">
          <p className="text-center text-slate-600 text-sm">
            Don't have an account? <Link to="/signup" className="text-brand-600 font-semibold hover:text-brand-700 transition">Create one</Link>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="mt-8 p-5 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
          <p className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <span className="text-lg">🔐</span> Demo Credentials
          </p>
          <div className="space-y-2 text-sm text-slate-700">
            <p><span className="font-medium">Email:</span> admin@jevitech.co.ke</p>
            <p><span className="font-medium">Password:</span> [Use your admin password]</p>
          </div>
        </div>
      </div>
    </div>
  )
}
