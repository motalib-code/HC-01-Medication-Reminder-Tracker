import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full space-y-8 p-6 bg-white rounded-lg shadow">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
              <h2 className="mt-4 text-2xl font-bold text-gray-900">Something went wrong</h2>
              <p className="mt-2 text-gray-600">
                We're sorry, but something went wrong. Please try refreshing the page.
              </p>
              {this.state.error && (
                <details className="mt-4 text-left bg-gray-50 p-4 rounded">
                  <summary className="font-medium text-gray-900 cursor-pointer">
                    Error details
                  </summary>
                  <pre className="mt-2 text-sm text-red-600 whitespace-pre-wrap">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
              <div className="mt-6">
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary