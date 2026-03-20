import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import PlansPage from './pages/PlansPage'
import ServicesPage from './pages/ServicesPage'
import CoveragePage from './pages/CoveragePage'
import ContactPage from './pages/ContactPage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import AdminDashboard from './pages/AdminDashboard'
import PaymentPage from './pages/PaymentPage'
import SupportPage from './pages/SupportPage'
import StatusPage from './pages/StatusPage'
import NotFoundPage from './pages/NotFoundPage'
import { getUser } from './services/user'

export default function App() {
  const token = localStorage.getItem('skdn_token')
  const user = getUser()

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/coverage" element={<CoveragePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={token ? <DashboardPage /> : <LoginPage />} />
          <Route path="/admin" element={token && user?.role === 'ADMIN' ? <AdminDashboard /> : <LoginPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/status" element={<StatusPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
