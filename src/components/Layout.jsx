import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <Navbar />
      <main className="flex-1 container py-10">{children}</main>
      <Footer />
    </div>
  )
}
