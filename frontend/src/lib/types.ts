export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  address?: string
  role: 'CUSTOMER' | 'ADMIN' | 'SUPPORT'
  createdAt: string
  updatedAt: string
}

export interface Plan {
  id: string
  name: string
  description: string
  speed: number
  price: number
  features: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Subscription {
  id: string
  userId: string
  planId: string
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'CANCELLED'
  startDate: string
  endDate?: string
  autoRenew: boolean
  createdAt: string
  updatedAt: string
  user?: User
  plan?: Plan
}

export interface Payment {
  id: string
  userId: string
  subscriptionId?: string
  amount: number
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
  paymentMethod: string
  transactionId?: string
  createdAt: string
  updatedAt: string
}

export interface SupportTicket {
  id: string
  userId: string
  subject: string
  description: string
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  category: string
  createdAt: string
  updatedAt: string
  user?: User
}

export interface InstallationRequest {
  id: string
  userId: string
  address: string
  preferredDate: string
  status: 'PENDING' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'
  notes?: string
  createdAt: string
  updatedAt: string
  user?: User
}

export interface NetworkStatus {
  id: string
  location: string
  status: 'UP' | 'DOWN' | 'MAINTENANCE'
  uptime: number
  lastChecked: string
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}