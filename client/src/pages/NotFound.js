import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="inline-block w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
          >
            Go Home
          </Link>
          <Link
            to="/dashboard"
            className="inline-block w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-200"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound
