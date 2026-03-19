import { useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout({ children }) {
  const location = useLocation()
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup'

  return (
    <div className={`min-h-screen flex flex-col ${isAuthPage ? 'bg-white' : 'bg-gradient-to-b from-slate-50 via-white to-slate-100'}`}>
      {!isAuthPage && <Navbar />}
      <main className={isAuthPage ? 'flex-1' : 'flex-1 container py-10'}>{children}</main>
      {!isAuthPage && <Footer />}
    </div>
  )
}
