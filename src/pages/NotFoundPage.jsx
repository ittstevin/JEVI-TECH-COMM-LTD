import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="grid min-h-[60vh] place-items-center p-8">
      <div className="text-center">
        <h1 className="text-5xl font-semibold text-slate-900">404</h1>
        <p className="mt-4 text-lg text-slate-600">Page not found</p>
        <p className="mt-2 text-sm text-slate-500">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
        >
          Return home
        </Link>
      </div>
    </div>
  )
}
