import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import PlansPage from './pages/PlansPage'
import CoveragePage from './pages/CoveragePage'
import ContactPage from './pages/ContactPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import PaymentPage from './pages/PaymentPage'
import SupportPage from './pages/SupportPage'
import StatusPage from './pages/StatusPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/coverage" element={<CoveragePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/status" element={<StatusPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
