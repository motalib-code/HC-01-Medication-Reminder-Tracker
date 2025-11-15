import { useState } from 'react'

interface ErrorState {
  message: string
  status?: number
  path?: string
}

export const useErrorHandler = () => {
  const [error, setError] = useState<ErrorState | null>(null)
  const [loading, setLoading] = useState(false)

  const handleError = (error: any) => {
    console.error('API Error:', error)
    
    if (error.status === 404) {
      setError({
        message: error.message || 'Resource not found',
        status: error.status,
        path: error.path
      })
    } else if (error.status === 401) {
      setError({
        message: error.message || 'Unauthorized access',
        status: error.status
      })
    } else if (error.status === 0) {
      setError({
        message: 'Network error - please check your connection',
        status: error.status
      })
    } else {
      setError({
        message: error.message || 'An unexpected error occurred',
        status: error.status
      })
    }
  }

  const clearError = () => {
    setError(null)
  }

  return {
    error,
    loading,
    setLoading,
    handleError,
    clearError
  }
}