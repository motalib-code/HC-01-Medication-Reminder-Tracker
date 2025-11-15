import { useState, useEffect } from 'react'
import { Notifications as NotificationsIcon } from '@mui/icons-material'
import api from '../services/api'

const Notifications = () => {
  const [notifications, setNotifications] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'read'>('all')
  const [stats, setStats] = useState({
    all: 0,
    unread: 0,
    read: 0,
  })

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications')
      const notifs = response.data.notifications || []
      setNotifications(notifs)
      setStats({
        all: notifs.length,
        unread: notifs.filter((n: any) => !n.read).length,
        read: notifs.filter((n: any) => n.read).length,
      })
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === 'unread') return !notif.read
    if (activeTab === 'read') return notif.read
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
          <NotificationsIcon className="text-blue-600" sx={{ fontSize: 28 }} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500 mt-1">
            Stay updated with your health alerts and reminders
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 rounded-xl shadow-sm p-6 text-center border border-blue-100">
          <p className="text-5xl font-bold text-blue-600 mb-2">{stats.all}</p>
          <p className="text-gray-700 font-medium">All</p>
        </div>
        <div className="bg-orange-50 rounded-xl shadow-sm p-6 text-center border border-orange-100">
          <p className="text-5xl font-bold text-orange-600 mb-2">{stats.unread}</p>
          <p className="text-gray-700 font-medium">Unread</p>
        </div>
        <div className="bg-green-50 rounded-xl shadow-sm p-6 text-center border border-green-100">
          <p className="text-5xl font-bold text-green-600 mb-2">{stats.read}</p>
          <p className="text-gray-700 font-medium">Read</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex px-6">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'all'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'unread'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => setActiveTab('read')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'read'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Read
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="p-6 min-h-96">
          {filteredNotifications.length > 0 ? (
            <div className="space-y-4">
              {filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 rounded-lg border ${
                    notif.read ? 'bg-gray-50 border-gray-200' : 'bg-white border-blue-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{notif.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(notif.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {!notif.read && (
                      <span className="w-2 h-2 bg-blue-600 rounded-full ml-4"></span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-80 text-center">
              <NotificationsIcon className="text-gray-300 mb-4" sx={{ fontSize: 80 }} />
              <p className="text-gray-500">No notifications</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Notifications

