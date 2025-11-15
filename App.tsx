import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from './hooks/redux'
import { verifyAuth } from './store/slices/authSlice'
import Layout from './components/Layout'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Medications from './pages/Medications'
import ScanPrescription from './pages/ScanPrescription'
import VoiceReminders from './pages/VoiceReminders'
import HealthRecords from './pages/HealthRecords'
import Appointments from './pages/Appointments'
import Analytics from './pages/Analytics'
import Notifications from './pages/Notifications'
import AIChat from './pages/AIChat'
import EmergencyContacts from './pages/EmergencyContacts'
import FamilyAccess from './pages/FamilyAccess'
import Profile from './pages/Profile'
import CaregiverDashboard from './pages/Caregiver/Dashboard'
import NotFound from './pages/NotFound'
import ErrorBoundary from './components/Error/ErrorBoundary'

function App() {
  const dispatch = useAppDispatch()
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      dispatch(verifyAuth())
    }
  }, [dispatch])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/app/dashboard" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/app/dashboard" />} />
        <Route path="/app" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="medications" element={<Medications />} />
          <Route path="scan-prescription" element={<ScanPrescription />} />
          <Route path="voice-reminders" element={<VoiceReminders />} />
          <Route path="health-records" element={<HealthRecords />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="ai-chat" element={<AIChat />} />
          <Route path="emergency" element={<EmergencyContacts />} />
          <Route path="family-access" element={<FamilyAccess />} />
          <Route path="profile" element={<Profile />} />
          <Route path="caregiver" element={<CaregiverDashboard />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  )
}

export default App