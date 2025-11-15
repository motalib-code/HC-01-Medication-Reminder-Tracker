import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  createdAt: string
}

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
}

export const fetchNotifications = createAsyncThunk(
  'notification/fetchAll',
  async () => {
    const response = await api.get('/users/notifications')
    return response.data.notifications
  }
)

export const markAsRead = createAsyncThunk(
  'notification/markRead',
  async (id: string) => {
    await api.put(`/users/notifications/${id}/read`)
    return id
  }
)

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload)
      if (!action.payload.read) {
        state.unreadCount++
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false
        state.notifications = action.payload
        state.unreadCount = action.payload.filter((n: Notification) => !n.read).length
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find((n) => n.id === action.payload)
        if (notification && !notification.read) {
          notification.read = true
          state.unreadCount--
        }
      })
  },
})

export const { addNotification } = notificationSlice.actions
export default notificationSlice.reducer
