import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

interface Appointment {
  id: string
  type: string
  scheduledDate: string
  duration: number
  status: string
  notes?: string
  meetingLink?: string
}

interface AppointmentState {
  appointments: Appointment[]
  loading: boolean
  error: string | null
}

const initialState: AppointmentState = {
  appointments: [],
  loading: false,
  error: null,
}

export const fetchAppointments = createAsyncThunk(
  'appointment/fetchAll',
  async () => {
    const response = await api.get('/appointments')
    return response.data.appointments
  }
)

export const createAppointment = createAsyncThunk(
  'appointment/create',
  async (appointmentData: any) => {
    const response = await api.post('/appointments', appointmentData)
    return response.data.appointment
  }
)

export const cancelAppointment = createAsyncThunk(
  'appointment/cancel',
  async (id: string) => {
    await api.post(`/appointments/${id}/cancel`)
    return id
  }
)

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false
        state.appointments = action.payload
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch appointments'
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.appointments.push(action.payload)
      })
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        const appointment = state.appointments.find((a) => a.id === action.payload)
        if (appointment) {
          appointment.status = 'cancelled'
        }
      })
  },
})

export const { clearError } = appointmentSlice.actions
export default appointmentSlice.reducer
