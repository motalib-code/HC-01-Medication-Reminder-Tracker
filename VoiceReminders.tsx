import { useState, useEffect } from 'react'
import { Add, Phone, Schedule, CheckCircle } from '@mui/icons-material'
import api from '../services/api'

const VoiceReminders = () => {
  const [reminders, setReminders] = useState<any[]>([])
  const [stats, setStats] = useState({
    active: 0,
    scheduled: 0,
    successRate: 0,
  })

  useEffect(() => {
    fetchReminders()
  }, [])

  const fetchReminders = async () => {
    try {
      const response = await api.get('/voice/reminders')
      setReminders(response.data.reminders || [])
      setStats({
        active: response.data.reminders?.filter((r: any) => r.active).length || 0,
        scheduled: response.data.reminders?.length || 0,
        successRate: 0,
      })
    } catch (error) {
      console.error('Error fetching reminders:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center">
        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
          <Phone className="text-purple-600" sx={{ fontSize: 28 }} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Voice Reminders</h1>
          <p className="text-gray-500 mt-1">
            Set up automated voice calls for medication reminders
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-500 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-2">Active Reminders</p>
              <p className="text-4xl font-bold">{stats.active}</p>
            </div>
            <Phone sx={{ fontSize: 48, opacity: 0.9 }} />
          </div>
        </div>

        <div className="bg-green-500 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-2">Scheduled Reminders</p>
              <p className="text-4xl font-bold">{stats.scheduled}</p>
            </div>
            <Schedule sx={{ fontSize: 48, opacity: 0.9 }} />
          </div>
        </div>

        <div className="bg-purple-500 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-2">Success Rate</p>
              <p className="text-4xl font-bold">{stats.successRate}%</p>
            </div>
            <CheckCircle sx={{ fontSize: 48, opacity: 0.9 }} />
          </div>
        </div>
      </div>

      {/* Active Reminders Section */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <Phone className="text-purple-600 mr-2" sx={{ fontSize: 24 }} />
            <h2 className="text-lg font-semibold text-gray-900">Active Reminders</h2>
          </div>
          <button className="flex items-center px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm">
            <Add className="mr-2" sx={{ fontSize: 20 }} />
            Add Voice Reminder
          </button>
        </div>
        <div className="p-16">
          {reminders.length > 0 ? (
            <div className="space-y-4">
              {reminders.map((reminder: any) => (
                <div key={reminder.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{reminder.medicationName}</p>
                      <p className="text-sm text-gray-500">{reminder.time}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      reminder.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {reminder.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Phone className="text-gray-300" sx={{ fontSize: 80 }} />
              </div>
              <p className="text-gray-900 mb-2">No voice reminders set up</p>
              <p className="text-gray-500 mb-6">
                Set up voice reminders to get automated calls for your medications
              </p>
              <button className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors mx-auto shadow-sm">
                <Add className="mr-2" sx={{ fontSize: 20 }} />
                Add Voice Reminder
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default VoiceReminders

