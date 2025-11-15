import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'
import socketService from '../../services/socket'

interface User {
  uid: string
  email: string
  name: string
  phone: string
  role: string
  language: 'en' | 'hi'
  dateOfBirth?: string
  address?: string
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: false,
  error: null,
}

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (userData: any) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  }
)

export const verifyAuth = createAsyncThunk('auth/verify', async () => {
  const response = await api.get('/auth/verify')
  return response.data
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('token')
      socketService.disconnect()
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
        localStorage.setItem('token', action.payload.token)
        socketService.connect(action.payload.token)
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Login failed'
      })
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
        localStorage.setItem('token', action.payload.token)
        socketService.connect(action.payload.token)
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Registration failed'
      })
      .addCase(verifyAuth.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.user = action.payload.user
        if (state.token) {
          socketService.connect(state.token)
        }
      })
      .addCase(verifyAuth.rejected, (state) => {
        state.isAuthenticated = false
        state.user = null
        state.token = null
        localStorage.removeItem('token')
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
