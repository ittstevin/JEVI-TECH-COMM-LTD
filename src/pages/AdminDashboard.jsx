import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { firestoreHelpers } from '../lib/firestoreHelpers'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('skdn_user') || 'null')
  const [stats, setStats] = useState({ users: 0, subscriptions: 0, tickets: 0, messages: 0, testimonials: 0 })
  const [activeTab, setActiveTab] = useState('overview')
  const [users, setUsers] = useState([])
  const [subscriptions, setSubscriptions] = useState([])
  const [tickets, setTickets] = useState([])
  const [messages, setMessages] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [serviceStatus, setServiceStatus] = useState([])
  const token = localStorage.getItem('skdn_token')

  useEffect(() => {
    if (!token || user?.role !== 'ADMIN') {
      navigate('/login')
      return
    }
    loadDashboardData()
  }, [token, user, navigate])

  const loadDashboardData = async () => {
    try {
      const usersRes = await firestoreHelpers.getCollection('users')
      const subsRes = await firestoreHelpers.getCollection('subscriptions')
      const ticketsRes = await firestoreHelpers.getCollection('tickets')
      const msgRes = await firestoreHelpers.getCollection('messages')
      const testRes = await firestoreHelpers.getCollection('testimonials')
      const statusRes = await firestoreHelpers.getCollection('serviceStatus')

      const usersData = usersRes.data || []
      const subsData = subsRes.data || []
      const ticketsData = ticketsRes.data || []
      const messagesData = msgRes.data || []
      const testData = testRes.data || []
      const statusData = statusRes.data || []

      setUsers(usersData)
      setSubscriptions(subsData)
      setTickets(ticketsData)
      setMessages(messagesData)
      setTestimonials(testData)
      setServiceStatus(statusData)

      setStats({
        users: usersData.length,
        subscriptions: subsData.length,
        tickets: ticketsData.length,
        messages: messagesData.length,
        testimonials: testData.length,
      })
    } catch (error) {
      console.error('Error loading dashboard:', error)
    }
  }

  const updateDocument = async (collection, docId, updates) => {
    try {
      const existing = await firestoreHelpers.getDocument(collection, docId)
      if (existing.error && existing.error !== 'Document not found') {
        console.error(`Error fetching ${collection}/${docId}`, existing.error)
        return
      }
      const payload = existing.data ? { ...existing.data, ...updates } : { ...updates }
      await firestoreHelpers.setDocument(collection, docId, payload)
      await loadDashboardData()
    } catch (error) {
      console.error(`Error updating ${collection}/${docId}:`, error)
    }
  }

  const approveTestimonial = async (id) => {
    await updateDocument('testimonials', id, { approved: true })
  }

  const deleteTestimonial = async (id) => {
    if (!confirm('Delete this testimonial?')) return
    try {
      // Firestore has no direct delete helper in our wrapper; use setDocument with empty object or a new helper.
      // Since only one place, perform direct Firestore delete:
      const { deleteDoc, doc } = await import('firebase/firestore')
      const { firestore } = await import('../lib/firebase')
      await deleteDoc(doc(firestore, 'testimonials', id))
      loadDashboardData()
    } catch (error) {
      console.error('Error deleting testimonial:', error)
    }
  }

  const updateTicketStatus = async (id, status) => {
    await updateDocument('tickets', id, { status })
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
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-brand-600">{stats.users}</div>
            <p className="text-slate-600 mt-2">Total Users</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-brand-600">{stats.subscriptions}</div>
            <p className="text-slate-600 mt-2">Subscriptions</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-brand-600">{stats.tickets}</div>
            <p className="text-slate-600 mt-2">Support Tickets</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-brand-600">{stats.messages}</div>
            <p className="text-slate-600 mt-2">Contact Messages</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-brand-600">{stats.testimonials}</div>
            <p className="text-slate-600 mt-2">Testimonials</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-300">
          {['overview', 'users', 'subscriptions', 'tickets', 'messages', 'testimonials', 'status'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-semibold rounded-t-lg ${
                activeTab === tab
                  ? 'bg-white border-t border-x border-brand-600 text-brand-600'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow overflow-hidden p-6">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-xl font-bold mb-3">Overview</h2>
              <p className="text-slate-600">Use the tabs to manage system data and respond to customer issues.</p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold">Service Status</h3>
                  <ul className="text-sm mt-2 text-slate-700">
                    {serviceStatus.length ? serviceStatus.map((status) => (
                      <li key={status.id}>{status.name}: <strong>{status.status}</strong></li>
                    )) : <li>No status entries available.</li>}
                  </ul>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold">Quick Actions</h3>
                  <p className="text-sm mt-2 text-slate-700">Change ticket states, approve feedback, or update subscription status from the tabs.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-100 border-b">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b hover:bg-slate-50">
                      <td className="px-4 py-3">{u.name || u.email}</td>
                      <td className="px-4 py-3">{u.email}</td>
                      <td className="px-4 py-3">{u.role}</td>
                      <td className="px-4 py-3">
                        {u.role !== 'ADMIN' && (
                          <button
                            onClick={() => updateDocument('users', u.id, { role: 'ADMIN' })}
                            className="mr-2 text-xs bg-green-500 text-white px-2 py-1 rounded"
                          >
                            Promote
                          </button>
                        )}
                        <button
                          onClick={() => updateDocument('users', u.id, { role: u.role === 'CUSTOMER' ? 'SUPPORT' : 'CUSTOMER' })}
                          className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
                        >
                          Toggle Role
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'subscriptions' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-100 border-b">
                  <tr>
                    <th className="px-4 py-3">User ID</th>
                    <th className="px-4 py-3">Plan</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Renewal</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((sub) => (
                    <tr key={sub.id} className="border-b hover:bg-slate-50">
                      <td className="px-4 py-3">{sub.userId}</td>
                      <td className="px-4 py-3">{sub.planId}</td>
                      <td className="px-4 py-3">{sub.status}</td>
                      <td className="px-4 py-3">{new Date(sub.renewalDate).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => updateDocument('subscriptions', sub.id, { status: sub.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' })}
                          className="text-xs bg-indigo-500 text-white px-2 py-1 rounded"
                        >
                          {sub.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'tickets' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-100 border-b">
                  <tr>
                    <th className="px-4 py-3">User ID</th>
                    <th className="px-4 py-3">Subject</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Created</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket.id} className="border-b hover:bg-slate-50">
                      <td className="px-4 py-3">{ticket.userId}</td>
                      <td className="px-4 py-3">{ticket.subject}</td>
                      <td className="px-4 py-3">{ticket.status}</td>
                      <td className="px-4 py-3">{new Date(ticket.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => updateTicketStatus(ticket.id, ticket.status === 'OPEN' ? 'RESOLVED' : 'OPEN')}
                          className="text-xs bg-orange-500 text-white px-2 py-1 rounded"
                        >
                          {ticket.status === 'OPEN' ? 'Resolve' : 'Reopen'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-100 border-b">
                  <tr>
                    <th className="px-4 py-3">From</th>
                    <th className="px-4 py-3">Message</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((msg) => (
                    <tr key={msg.id} className="border-b hover:bg-slate-50">
                      <td className="px-4 py-3">{msg.email || msg.name}</td>
                      <td className="px-4 py-3 truncate">{msg.message}</td>
                      <td className="px-4 py-3">{msg.status || 'NEW'}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => updateDocument('messages', msg.id, { status: 'RESPONDED' })}
                          className="text-xs bg-blue-600 text-white px-2 py-1 rounded"
                        >
                          Mark Responded
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'testimonials' && (
            <div className="grid gap-4">
              {testimonials.map((test) => (
                <div key={test.id} className="border rounded-lg p-4">
                  <div className="flex justify-between">
                    <strong>{test.user?.name || test.email || 'User'}</strong>
                    <span>{test.approved ? 'Approved' : 'Pending'}</span>
                  </div>
                  <p className="mt-2 text-slate-700">{test.message}</p>
                  <div className="mt-3 flex gap-2">
                    {!test.approved && (
                      <button onClick={() => approveTestimonial(test.id)} className="px-3 py-1 text-xs bg-green-600 text-white rounded">Approve</button>
                    )}
                    <button onClick={() => deleteTestimonial(test.id)} className="px-3 py-1 text-xs bg-red-600 text-white rounded">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'status' && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Service Status</h3>
              {serviceStatus.length > 0 ? (
                <ul className="space-y-2">
                  {serviceStatus.map((s) => (
                    <li key={s.id} className="border p-3 rounded-lg bg-slate-50">
                      <div className="flex justify-between items-center">
                        <span>{s.name}</span>
                        <span className="text-sm font-medium">{s.status}</span>
                      </div>
                      <p className="text-sm text-slate-600">{s.note || 'No notes'}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-600">No service status entries found.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
