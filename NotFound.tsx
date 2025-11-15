import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto h-24 w-24 rounded-full bg-red-100 flex items-center justify-center">
          <span className="text-4xl">❓</span>
        </div>
        <h1 className="mt-6 text-4xl font-bold text-gray-900">404</h1>
        <h2 className="mt-2 text-2xl font-bold text-gray-900">Page Not Found</h2>
        <p className="mt-4 text-gray-600">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="mt-8">
          <Link
            to="/dashboard"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go back home
          </Link>
        </div>
        <div className="mt-6">
          <p className="text-gray-500 text-sm">
            If you believe this is an error, please contact support.
          </p>
        </div>
      </div>
    </div>
  )
}

export default NotFound