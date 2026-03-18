import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container grid gap-8 py-12 md:grid-cols-4">
        <div>
          <h3 className="text-lg font-bold">SKY DOT NETWORKS</h3>
          <p className="mt-2 text-sm text-slate-300">Premium Internet Services for Everyone</p>
          <div className="mt-4 space-y-2 text-sm text-slate-300">
            <p>
              <span className="font-semibold">Phone:</span> <a href="tel:+254793208000" className="hover:text-white">+254 793 208 000</a>
            </p>
            <p>
              <span className="font-semibold">Email:</span> <a href="mailto:skydotnetworks@gmail.com" className="hover:text-white">skydotnetworks@gmail.com</a>
            </p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Services</h4>
          <ul className="space-y-2 text-sm text-slate-300">
            <li><Link to="/services#ftth" className="hover:text-white">Fiber Internet (FTTH)</Link></li>
            <li><Link to="/services#wireless" className="hover:text-white">Wireless Internet</Link></li>
            <li><Link to="/services#business" className="hover:text-white">Business Internet</Link></li>
            <li><Link to="/services#support" className="hover:text-white">24/7 Support</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm text-slate-300">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/plans" className="hover:text-white">Plans</Link></li>
            <li><Link to="/coverage" className="hover:text-white">Coverage</Link></li>
            <li><Link to="/support" className="hover:text-white">Support</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-slate-300">
            <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white">Terms & Conditions</a></li>
            <li><a href="#" className="hover:text-white">Blog</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-700 py-6">
        <div className="container flex flex-col items-center justify-between gap-4 text-sm text-slate-400 md:flex-row">
          <p>© {new Date().getFullYear()} SKY DOT NETWORKS. All rights reserved.</p>
          <p className="text-xs">
            Premium Internet Services | Kenya
          </p>
        </div>
      </div>
    </footer>
  )
}
