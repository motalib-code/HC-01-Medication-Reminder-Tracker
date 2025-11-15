import { useEffect, useState } from 'react'
import { Add, CalendarToday, Schedule, CheckCircle } from '@mui/icons-material'
import api from '../services/api'
import { toast } from 'react-toastify'

const Appointments = () => {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'upcoming' | 'today' | 'past'>('upcoming')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/api/appointments')
      setAppointments(response.data.appointments || [])
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const stats = {
    total: appointments.length,
    upcoming: appointments.filter(a => new Date(a.scheduledDate) > new Date() && a.status === 'scheduled').length,
    completed: appointments.filter(a => a.status === 'completed').length,
  }

  const filteredAppointments = appointments.filter((apt) => {
    const aptDate = new Date(apt.scheduledDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (activeTab === 'upcoming') {
      return aptDate > new Date() && apt.status === 'scheduled'
    }
    if (activeTab === 'today') {
      return aptDate.toDateString() === today.toDateString()
    }
    return aptDate < today || apt.status === 'completed' || apt.status === 'cancelled'
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading appointments...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
            <CalendarToday className="text-purple-600" sx={{ fontSize: 28 }} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
            <p className="text-gray-500 mt-1">
              Manage your medical appointments and consultations
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
        >
          <Add className="mr-2" sx={{ fontSize: 20 }} />
          Book Appointment
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-purple-500 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-2">Total Appointments</p>
              <p className="text-4xl font-bold">{stats.total}</p>
            </div>
            <CalendarToday sx={{ fontSize: 48, opacity: 0.9 }} />
          </div>
        </div>

        <div className="bg-blue-500 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-2">Upcoming</p>
              <p className="text-4xl font-bold">{stats.upcoming}</p>
            </div>
            <Schedule sx={{ fontSize: 48, opacity: 0.9 }} />
          </div>
        </div>

        <div className="bg-green-500 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-2">Completed</p>
              <p className="text-4xl font-bold">{stats.completed}</p>
            </div>
            <CheckCircle sx={{ fontSize: 48, opacity: 0.9 }} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex px-6">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'upcoming'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Upcoming ({stats.upcoming})
            </button>
            <button
              onClick={() => setActiveTab('today')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'today'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Today (0)
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'past'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Past (0)
            </button>
          </div>
        </div>

        {/* Appointments List */}
        <div className="p-6 min-h-96">
          {showForm ? (
            <AppointmentForm
              onSuccess={() => {
                setShowForm(false)
                fetchAppointments()
              }}
              onCancel={() => setShowForm(false)}
            />
          ) : filteredAppointments.length > 0 ? (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {appointment.type?.charAt(0).toUpperCase() + appointment.type?.slice(1) || 'Appointment'}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(appointment.scheduledDate).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">Duration: {appointment.duration} minutes</p>
                      {appointment.meetingLink && (
                        <a
                          href={appointment.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline mt-1 block"
                        >
                          Join Meeting
                        </a>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-80 text-center">
              <CalendarToday className="text-gray-300 mb-4" sx={{ fontSize: 80 }} />
              <p className="text-gray-900 mb-4">No upcoming appointments</p>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
              >
                <Add className="mr-2" sx={{ fontSize: 20 }} />
                Book Appointment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const AppointmentForm = ({ onSuccess, onCancel }: any) => {
  const [formData, setFormData] = useState({
    type: 'telemedicine',
    scheduledDate: '',
    duration: 30,
    notes: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.post('/api/appointments', {
        ...formData,
        scheduledDate: new Date(formData.scheduledDate).toISOString(),
      })
      toast.success('Appointment booked successfully')
      onSuccess()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to book appointment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Type</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="telemedicine">Telemedicine</option>
          <option value="in-person">In-Person</option>
          <option value="follow-up">Follow-up</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date and Time</label>
        <input
          type="datetime-local"
          required
          value={formData.scheduledDate}
          onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
        <input
          type="number"
          required
          min="15"
          max="120"
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 30 })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          rows={3}
        />
      </div>
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? 'Booking...' : 'Book Appointment'}
        </button>
      </div>
    </form>
  )
}

export default Appointments
