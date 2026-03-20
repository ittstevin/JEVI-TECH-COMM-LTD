import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { firestoreHelpers } from '../lib/firestoreHelpers'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [user] = useState(() => JSON.parse(localStorage.getItem('skdn_user') || 'null'))
  const [stats, setStats] = useState({ users: 0, subscriptions: 0, tickets: 0, messages: 0, testimonials: 0 })
  const [activeTab, setActiveTab] = useState('overview')
  const [users, setUsers] = useState([])
  const [subscriptions, setSubscriptions] = useState([])
  const [tickets, setTickets] = useState([])
  const [messages, setMessages] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [serviceStatus, setServiceStatus] = useState([])
  const [editingItem, setEditingItem] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [loading, setLoading] = useState(true)
  const [loadErrors, setLoadErrors] = useState({})
  const token = localStorage.getItem('skdn_token')

  useEffect(() => {
    if (!token || user?.role !== 'ADMIN') {
      navigate('/login')
      return
    }
    loadDashboardData()
  }, [token, user?.role, navigate])

  const loadDashboardData = async () => {
    setLoading(true)
    setLoadErrors({})
    
    try {
      const [usersRes, subsRes, ticketsRes, msgRes, testRes, statusRes] = await Promise.all([
        firestoreHelpers.getCollection('users'),
        firestoreHelpers.getCollection('subscriptions'),
        firestoreHelpers.getCollection('tickets'),
        firestoreHelpers.getCollection('messages'),
        firestoreHelpers.getCollection('testimonials'),
        firestoreHelpers.getCollection('serviceStatus')
      ])

      const errors = {}
      if (usersRes.error) errors.users = usersRes.error
      if (subsRes.error) errors.subscriptions = subsRes.error
      if (ticketsRes.error) errors.tickets = ticketsRes.error
      if (msgRes.error) errors.messages = msgRes.error
      if (testRes.error) errors.testimonials = testRes.error
      if (statusRes.error) errors.serviceStatus = statusRes.error

      setLoadErrors(errors)

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
      setLoadErrors({ general: 'Failed to load dashboard data' })
    } finally {
      setLoading(false)
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
    try {
      await updateDocument('testimonials', id, { approved: true })
      loadDashboardData()
    } catch (error) {
      console.error('Error approving testimonial:', error)
    }
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

  const startEditing = (collection, item) => {
    setEditingItem({ collection, id: item.id || null })
    setEditForm({ ...item })
  }

  const cancelEditing = () => {
    setEditingItem(null)
    setEditForm({})
  }

  const saveEditing = async () => {
    if (!editingItem) return
    try {
      if (editingItem.id) {
        // Update existing document
        await updateDocument(editingItem.collection, editingItem.id, editForm)
      } else {
        // Create new document
        const result = await firestoreHelpers.createDocument(editingItem.collection, editForm)
        if (result.error) {
          console.error('Error creating document:', result.error)
          return
        }
      }
      setEditingItem(null)
      setEditForm({})
      loadDashboardData()
    } catch (error) {
      console.error('Error saving:', error)
    }
  }

  const handleEditChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }))
  }

  const deleteDocument = async (collection, id) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    try {
      const { deleteDoc, doc } = await import('firebase/firestore')
      const { firestore } = await import('../lib/firebase')
      await deleteDoc(doc(firestore, collection, id))
      loadDashboardData()
    } catch (error) {
      console.error(`Error deleting ${collection}/${id}:`, error)
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
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto"></div>
              <p className="mt-4 text-slate-600">Loading dashboard data...</p>
            </div>
          ) : Object.keys(loadErrors).length > 0 ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-4">Data Loading Issues</h3>
              <div className="space-y-2">
                {loadErrors.general && (
                  <p className="text-red-700">❌ {loadErrors.general}</p>
                )}
                {loadErrors.users && (
                  <p className="text-red-700">👥 Users: {loadErrors.users}</p>
                )}
                {loadErrors.subscriptions && (
                  <p className="text-red-700">📋 Subscriptions: {loadErrors.subscriptions}</p>
                )}
                {loadErrors.tickets && (
                  <p className="text-red-700">🎫 Tickets: {loadErrors.tickets}</p>
                )}
                {loadErrors.messages && (
                  <p className="text-red-700">💬 Messages: {loadErrors.messages}</p>
                )}
                {loadErrors.testimonials && (
                  <p className="text-red-700">⭐ Testimonials: {loadErrors.testimonials}</p>
                )}
                {loadErrors.serviceStatus && (
                  <p className="text-red-700">⚙️ Service Status: {loadErrors.serviceStatus}</p>
                )}
              </div>
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-yellow-800 text-sm">
                  <strong>Common Issue:</strong> Firestore permissions may not be configured correctly. 
                  Make sure your Firestore rules allow authenticated users to read/write data.
                </p>
                <button 
                  onClick={loadDashboardData}
                  className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-sm"
                >
                  Retry Loading
                </button>
              </div>
            </div>
          ) : (
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
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b hover:bg-slate-50">
                      {editingItem?.collection === 'users' && editingItem?.id === u.id ? (
                        <>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={editForm.name || ''}
                              onChange={(e) => handleEditChange('name', e.target.value)}
                              className="w-full px-2 py-1 border rounded"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="email"
                              value={editForm.email || ''}
                              onChange={(e) => handleEditChange('email', e.target.value)}
                              className="w-full px-2 py-1 border rounded"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={editForm.phone || ''}
                              onChange={(e) => handleEditChange('phone', e.target.value)}
                              className="w-full px-2 py-1 border rounded"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={editForm.role || 'CUSTOMER'}
                              onChange={(e) => handleEditChange('role', e.target.value)}
                              className="px-2 py-1 border rounded"
                            >
                              <option value="CUSTOMER">Customer</option>
                              <option value="SUPPORT">Support</option>
                              <option value="ADMIN">Admin</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <button onClick={saveEditing} className="mr-2 text-xs bg-green-500 text-white px-2 py-1 rounded">Save</button>
                            <button onClick={cancelEditing} className="text-xs bg-gray-500 text-white px-2 py-1 rounded">Cancel</button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-3">{u.name || u.email}</td>
                          <td className="px-4 py-3">{u.email}</td>
                          <td className="px-4 py-3">{u.phone || 'N/A'}</td>
                          <td className="px-4 py-3">{u.role}</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => startEditing('users', u)}
                              className="mr-2 text-xs bg-blue-500 text-white px-2 py-1 rounded"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteDocument('users', u.id)}
                              className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                            >
                              Delete
                            </button>
                          </td>
                        </>
                      )}
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
                    <th className="px-4 py-3">Renewal Date</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((sub) => (
                    <tr key={sub.id} className="border-b hover:bg-slate-50">
                      {editingItem?.collection === 'subscriptions' && editingItem?.id === sub.id ? (
                        <>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={editForm.userId || ''}
                              onChange={(e) => handleEditChange('userId', e.target.value)}
                              className="w-full px-2 py-1 border rounded"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={editForm.planId || ''}
                              onChange={(e) => handleEditChange('planId', e.target.value)}
                              className="w-full px-2 py-1 border rounded"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={editForm.status || 'ACTIVE'}
                              onChange={(e) => handleEditChange('status', e.target.value)}
                              className="px-2 py-1 border rounded"
                            >
                              <option value="ACTIVE">Active</option>
                              <option value="SUSPENDED">Suspended</option>
                              <option value="CANCELLED">Cancelled</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="date"
                              value={editForm.renewalDate ? new Date(editForm.renewalDate).toISOString().split('T')[0] : ''}
                              onChange={(e) => handleEditChange('renewalDate', new Date(e.target.value).getTime())}
                              className="px-2 py-1 border rounded"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <button onClick={saveEditing} className="mr-2 text-xs bg-green-500 text-white px-2 py-1 rounded">Save</button>
                            <button onClick={cancelEditing} className="text-xs bg-gray-500 text-white px-2 py-1 rounded">Cancel</button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-3">{sub.userId}</td>
                          <td className="px-4 py-3">{sub.planId}</td>
                          <td className="px-4 py-3">{sub.status}</td>
                          <td className="px-4 py-3">{new Date(sub.renewalDate).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => startEditing('subscriptions', sub)}
                              className="mr-2 text-xs bg-blue-500 text-white px-2 py-1 rounded"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteDocument('subscriptions', sub.id)}
                              className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                            >
                              Delete
                            </button>
                          </td>
                        </>
                      )}
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
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Created</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket.id} className="border-b hover:bg-slate-50">
                      {editingItem?.collection === 'tickets' && editingItem?.id === ticket.id ? (
                        <>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={editForm.userId || ''}
                              onChange={(e) => handleEditChange('userId', e.target.value)}
                              className="w-full px-2 py-1 border rounded"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={editForm.subject || ''}
                              onChange={(e) => handleEditChange('subject', e.target.value)}
                              className="w-full px-2 py-1 border rounded"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <textarea
                              value={editForm.description || ''}
                              onChange={(e) => handleEditChange('description', e.target.value)}
                              className="w-full px-2 py-1 border rounded"
                              rows="2"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={editForm.status || 'OPEN'}
                              onChange={(e) => handleEditChange('status', e.target.value)}
                              className="px-2 py-1 border rounded"
                            >
                              <option value="OPEN">Open</option>
                              <option value="IN_PROGRESS">In Progress</option>
                              <option value="RESOLVED">Resolved</option>
                              <option value="CLOSED">Closed</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">{new Date(ticket.createdAt).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
                            <button onClick={saveEditing} className="mr-2 text-xs bg-green-500 text-white px-2 py-1 rounded">Save</button>
                            <button onClick={cancelEditing} className="text-xs bg-gray-500 text-white px-2 py-1 rounded">Cancel</button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-3">{ticket.userId}</td>
                          <td className="px-4 py-3">{ticket.subject}</td>
                          <td className="px-4 py-3 truncate max-w-xs">{ticket.description}</td>
                          <td className="px-4 py-3">{ticket.status}</td>
                          <td className="px-4 py-3">{new Date(ticket.createdAt).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => startEditing('tickets', ticket)}
                              className="mr-2 text-xs bg-blue-500 text-white px-2 py-1 rounded"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteDocument('tickets', ticket.id)}
                              className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                            >
                              Delete
                            </button>
                          </td>
                        </>
                      )}
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
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Subject</th>
                    <th className="px-4 py-3">Message</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((msg) => (
                    <tr key={msg.id} className="border-b hover:bg-slate-50">
                      {editingItem?.collection === 'messages' && editingItem?.id === msg.id ? (
                        <>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={editForm.name || ''}
                              onChange={(e) => handleEditChange('name', e.target.value)}
                              className="w-full px-2 py-1 border rounded"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="email"
                              value={editForm.email || ''}
                              onChange={(e) => handleEditChange('email', e.target.value)}
                              className="w-full px-2 py-1 border rounded"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={editForm.phone || ''}
                              onChange={(e) => handleEditChange('phone', e.target.value)}
                              className="w-full px-2 py-1 border rounded"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={editForm.subject || ''}
                              onChange={(e) => handleEditChange('subject', e.target.value)}
                              className="w-full px-2 py-1 border rounded"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <textarea
                              value={editForm.message || ''}
                              onChange={(e) => handleEditChange('message', e.target.value)}
                              className="w-full px-2 py-1 border rounded"
                              rows="2"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={editForm.status || 'NEW'}
                              onChange={(e) => handleEditChange('status', e.target.value)}
                              className="px-2 py-1 border rounded"
                            >
                              <option value="NEW">New</option>
                              <option value="READ">Read</option>
                              <option value="RESPONDED">Responded</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <button onClick={saveEditing} className="mr-2 text-xs bg-green-500 text-white px-2 py-1 rounded">Save</button>
                            <button onClick={cancelEditing} className="text-xs bg-gray-500 text-white px-2 py-1 rounded">Cancel</button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-3">{msg.name || 'N/A'}</td>
                          <td className="px-4 py-3">{msg.email}</td>
                          <td className="px-4 py-3">{msg.phone || 'N/A'}</td>
                          <td className="px-4 py-3">{msg.subject || 'N/A'}</td>
                          <td className="px-4 py-3 truncate max-w-xs">{msg.message}</td>
                          <td className="px-4 py-3">{msg.status || 'NEW'}</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => startEditing('messages', msg)}
                              className="mr-2 text-xs bg-blue-500 text-white px-2 py-1 rounded"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteDocument('messages', msg.id)}
                              className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                            >
                              Delete
                            </button>
                          </td>
                        </>
                      )}
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
                  {editingItem?.collection === 'testimonials' && editingItem?.id === test.id ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                          type="text"
                          value={editForm.name || ''}
                          onChange={(e) => handleEditChange('name', e.target.value)}
                          className="w-full px-3 py-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                          type="email"
                          value={editForm.email || ''}
                          onChange={(e) => handleEditChange('email', e.target.value)}
                          className="w-full px-3 py-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Message</label>
                        <textarea
                          value={editForm.message || ''}
                          onChange={(e) => handleEditChange('message', e.target.value)}
                          className="w-full px-3 py-2 border rounded"
                          rows="3"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Approved</label>
                        <select
                          value={editForm.approved ? 'true' : 'false'}
                          onChange={(e) => handleEditChange('approved', e.target.value === 'true')}
                          className="px-3 py-2 border rounded"
                        >
                          <option value="false">Pending</option>
                          <option value="true">Approved</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={saveEditing} className="px-3 py-1 bg-green-500 text-white rounded">Save</button>
                        <button onClick={cancelEditing} className="px-3 py-1 bg-gray-500 text-white rounded">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <strong>{test.name || test.email || 'User'}</strong>
                        <span className={`px-2 py-1 rounded text-xs ${test.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {test.approved ? 'Approved' : 'Pending'}
                        </span>
                      </div>
                      <p className="mt-2 text-slate-700">{test.message}</p>
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => startEditing('testimonials', test)}
                          className="px-3 py-1 text-xs bg-blue-500 text-white rounded"
                        >
                          Edit
                        </button>
                        {!test.approved && (
                          <button onClick={() => approveTestimonial(test.id)} className="px-3 py-1 text-xs bg-green-600 text-white rounded">Approve</button>
                        )}
                        <button onClick={() => deleteTestimonial(test.id)} className="px-3 py-1 text-xs bg-red-600 text-white rounded">Delete</button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'status' && (
            <div>
              <div className="mb-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold">Service Status</h3>
                <button
                  onClick={() => startEditing('serviceStatus', { name: '', status: 'ok', note: '' })}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add Service
                </button>
              </div>
              {serviceStatus.length > 0 ? (
                <div className="space-y-4">
                  {serviceStatus.map((s) => (
                    <div key={s.id} className="border p-4 rounded-lg bg-slate-50">
                      {editingItem?.collection === 'serviceStatus' && editingItem?.id === s.id ? (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Service Name</label>
                            <input
                              type="text"
                              value={editForm.name || ''}
                              onChange={(e) => handleEditChange('name', e.target.value)}
                              className="w-full px-3 py-2 border rounded"
                              placeholder="e.g., Core network"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <select
                              value={editForm.status || 'ok'}
                              onChange={(e) => handleEditChange('status', e.target.value)}
                              className="px-3 py-2 border rounded"
                            >
                              <option value="ok">Operational</option>
                              <option value="maintenance">Maintenance</option>
                              <option value="outage">Outage</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Note</label>
                            <textarea
                              value={editForm.note || ''}
                              onChange={(e) => handleEditChange('note', e.target.value)}
                              className="w-full px-3 py-2 border rounded"
                              rows="2"
                              placeholder="Optional notes about the service status"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button onClick={saveEditing} className="px-3 py-1 bg-green-500 text-white rounded">Save</button>
                            <button onClick={cancelEditing} className="px-3 py-1 bg-gray-500 text-white rounded">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{s.name}</span>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                s.status === 'ok' ? 'bg-green-100 text-green-800' :
                                s.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {s.status === 'ok' ? 'Operational' : s.status === 'maintenance' ? 'Maintenance' : 'Outage'}
                              </span>
                              <button
                                onClick={() => startEditing('serviceStatus', s)}
                                className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteDocument('serviceStatus', s.id)}
                                className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                          {s.note && <p className="text-sm text-slate-600 mt-2">{s.note}</p>}
                        </>
                      )}
                    </div>
                  ))}
                </div>
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
