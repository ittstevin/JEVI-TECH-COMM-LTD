'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/Button'
import Card from '@/components/Card'
import Loading from '@/components/Loading'
import { useAuthStore } from '@/lib/store'
import { Subscription, Payment, SupportTicket } from '@/lib/types'
import { formatCurrency, formatSpeed, formatDate } from '@/utils/format'
import api from '@/lib/api'

export default function DashboardPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [recentPayments, setRecentPayments] = useState<Payment[]>([])
  const [recentTickets, setRecentTickets] = useState<SupportTicket[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    fetchDashboardData()
  }, [user, router])

  const fetchDashboardData = async () => {
    try {
      const [subscriptionRes, paymentsRes, ticketsRes] = await Promise.all([
        api.get('/subscriptions/my-subscription'),
        api.get('/payments/my-payments?limit=5'),
        api.get('/tickets/my-tickets?limit=5'),
      ])

      setSubscription(subscriptionRes.data)
      setRecentPayments(paymentsRes.data)
      setRecentTickets(ticketsRes.data)
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={fetchDashboardData}>Try Again</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
              <span className="text-gray-700">Welcome, {user?.firstName}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your internet service and account</p>
        </div>

        {/* Current Plan */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Plan</h2>
          {subscription ? (
            <Card>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {subscription.plan?.name}
                  </h3>
                  <p className="text-gray-600 mb-2">{subscription.plan?.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Speed: {formatSpeed(subscription.plan?.speed || 0)}</span>
                    <span>Price: {formatCurrency(subscription.plan?.price || 0)}/month</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      subscription.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {subscription.status}
                    </span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <Button onClick={() => router.push('/plans')}>
                    Change Plan
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card>
              <div className="text-center py-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Subscription</h3>
                <p className="text-gray-600 mb-4">You don't have an active internet plan yet.</p>
                <Button onClick={() => router.push('/plans')}>
                  Browse Plans
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">View Bills</h3>
                <p className="text-sm text-gray-600">Check your payment history</p>
              </div>
            </Card>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Support</h3>
                <p className="text-sm text-gray-600">Get help from our team</p>
              </div>
            </Card>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Settings</h3>
                <p className="text-sm text-gray-600">Manage your account</p>
              </div>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Payments */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Payments</h2>
            <Card>
              {recentPayments.length === 0 ? (
                <p className="text-gray-600 text-center py-4">No recent payments</p>
              ) : (
                <div className="space-y-4">
                  {recentPayments.map((payment) => (
                    <div key={payment.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <div>
                        <p className="font-medium text-gray-900">{formatCurrency(payment.amount)}</p>
                        <p className="text-sm text-gray-600">{formatDate(payment.createdAt)}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        payment.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-800'
                          : payment.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {payment.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Recent Support Tickets */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Support Tickets</h2>
            <Card>
              {recentTickets.length === 0 ? (
                <p className="text-gray-600 text-center py-4">No recent tickets</p>
              ) : (
                <div className="space-y-4">
                  {recentTickets.map((ticket) => (
                    <div key={ticket.id} className="py-2 border-b border-gray-100 last:border-b-0">
                      <p className="font-medium text-gray-900">{ticket.subject}</p>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-sm text-gray-600">{formatDate(ticket.createdAt)}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          ticket.status === 'RESOLVED'
                            ? 'bg-green-100 text-green-800'
                            : ticket.status === 'IN_PROGRESS'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {ticket.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}