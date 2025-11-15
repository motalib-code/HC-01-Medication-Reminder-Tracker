import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import medicationReducer from './slices/medicationSlice'
import aiReducer from './slices/aiSlice'
import appointmentReducer from './slices/appointmentSlice'
import notificationReducer from './slices/notificationSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    medication: medicationReducer,
    ai: aiReducer,
    appointment: appointmentReducer,
    notification: notificationReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
