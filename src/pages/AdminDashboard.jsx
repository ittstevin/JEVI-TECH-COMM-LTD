import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('skdn_user') || 'null')
  const [stats, setStats] = useState({ users: 0, tickets: 0, messages: 0, testimonials: 0 })
  const [activeTab, setActiveTab] = useState('overview')
  const [messages, setMessages] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const token = localStorage.getItem('skdn_token')

  useEffect(() => {
    if (!token || user?.role !== 'ADMIN') {
      navigate('/login')
      return
    }
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const msgRes = await fetch('http://localhost:5000/api/messages', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const testRes = await fetch('http://localhost:5000/api/testimonials/admin/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (msgRes.ok) {
        const msgData = await msgRes.json()
        setMessages(msgData.messages || [])
      }
      if (testRes.ok) {
        const testData = await testRes.json()
        setTestimonials(testData.testimonials || [])
      }
    } catch (error) {
      console.error('Error loading dashboard:', error)
    }
  }

  const approveTestimonial = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/testimonials/admin/approve/${id}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        loadDashboardData()
      }
    } catch (error) {
      console.error('Error approving testimonial:', error)
    }
  }

  const deleteTestimonial = async (id) => {
    if (confirm('Delete this testimonial?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/testimonials/admin/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (response.ok) {
          loadDashboardData()
        }
      } catch (error) {
        console.error('Error deleting testimonial:', error)
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-brand-600 text-white py-8">
        <div className="container flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-brand-100">Welcome, {user?.name}</p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('skdn_token')
              localStorage.removeItem('skdn_user')
              navigate('/login')
            }}
            className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="container py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-brand-600">{messages.length}</div>
            <p className="text-slate-600 mt-2">Contact Messages</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-brand-600">{testimonials.length}</div>
            <p className="text-slate-600 mt-2">Testimonials</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-brand-600">0</div>
            <p className="text-slate-600 mt-2">Support Tickets</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-brand-600">0</div>
            <p className="text-slate-600 mt-2">Active Users</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-300">
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-3 font-semibold border-b-2 ${
              activeTab === 'messages'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-600'
            }`}
          >
            Messages
          </button>
          <button
            onClick={() => setActiveTab('testimonials')}
            className={`px-4 py-3 font-semibold border-b-2 ${
              activeTab === 'testimonials'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-600'
            }`}
          >
            Testimonials
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {activeTab === 'messages' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">From</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Subject</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Message</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((msg) => (
                    <tr key={msg.id} className="border-b hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm">{msg.name}</td>
                      <td className="px-6 py-4 text-sm">{msg.subject || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm truncate">{msg.message}</td>
                      <td className="px-6 py-4 text-sm">{new Date(msg.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'testimonials' && (
            <div className="p-6 space-y-4">
              {testimonials.map((test) => (
                <div key={test.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-slate-900">{test.user.name}</p>
                      <p className="text-xs text-slate-500">{new Date(test.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded ${
                      test.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {test.approved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-slate-700 mb-3">{test.message}</p>
                  <div className="flex gap-2">
                    {!test.approved && (
                      <button
                        onClick={() => approveTestimonial(test.id)}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => deleteTestimonial(test.id)}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
