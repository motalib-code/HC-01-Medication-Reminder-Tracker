import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response
      
      // Handle 401 Unauthorized
      if (status === 401) {
        localStorage.removeItem('token')
        window.location.href = '/login'
        return Promise.reject({
          message: data.message || 'Unauthorized access',
          status
        })
      }
      
      // Handle 404 Not Found
      if (status === 404) {
        return Promise.reject({
          message: data.message || 'Resource not found',
          status,
          path: data.path || error.config?.url
        })
      }
      
      // Handle other error statuses
      return Promise.reject({
        message: data.message || data.error || 'An error occurred',
        status,
        ...data
      })
    } else if (error.request) {
      // Network error
      return Promise.reject({
        message: 'Network error - please check your connection',
        status: 0
      })
    } else {
      // Request setup error
      return Promise.reject({
        message: error.message || 'An error occurred',
        status: -1
      })
    }
  }
)

export default api