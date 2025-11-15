import { useEffect, useState } from 'react'
import { Medication, TrendingUp, Cancel, Favorite } from '@mui/icons-material'
import api from '../services/api'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const Analytics = () => {
  const [stats, setStats] = useState({
    activeMedications: 0,
    adherenceRate: 0,
    missedDoses: 0,
    aiQueries: 0,
  })
  const [adherenceData, setAdherenceData] = useState<any[]>([])

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      // Fetch medication stats
      const medResponse = await api.get('/medications')
      const activeMeds = medResponse.data.medications?.filter((m: any) => m.active) || []
      
      // Mock adherence data for 7 days
      const mockData = [
        { day: 'Mon', adherence: 100 },
        { day: 'Tue', adherence: 95 },
        { day: 'Wed', adherence: 100 },
        { day: 'Thu', adherence: 90 },
        { day: 'Fri', adherence: 100 },
        { day: 'Sat', adherence: 85 },
        { day: 'Sun', adherence: 100 },
      ]

      setStats({
        activeMedications: activeMeds.length,
        adherenceRate: 95.7,
        missedDoses: 2,
        aiQueries: 0,
      })
      setAdherenceData(mockData)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    }
  }

  const getHealthScore = () => {
    return Math.round((stats.adherenceRate * 0.7) + ((100 - stats.missedDoses * 5) * 0.3))
  }

  const getHealthStatus = (score: number) => {
    if (score >= 90) return { label: 'Excellent', color: 'bg-green-500' }
    if (score >= 75) return { label: 'Good', color: 'bg-blue-500' }
    if (score >= 60) return { label: 'Fair', color: 'bg-yellow-500' }
    return { label: 'Poor', color: 'bg-red-500' }
  }

  const healthScore = getHealthScore()
  const healthStatus = getHealthStatus(healthScore)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center">
        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
          <TrendingUp className="text-purple-600" sx={{ fontSize: 28 }} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Health Analytics</h1>
          <p className="text-gray-500 mt-1">
            Track your medication adherence and health trends
          </p>
        </div>
      </div>

      {/* Overall Health Score Card */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-400 rounded-xl shadow-sm p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90 mb-2">Overall Health Score</p>
            <div className="flex items-baseline gap-3">
              <p className="text-5xl font-bold">{healthScore}</p>
              <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-white bg-opacity-20">
                {healthStatus.label}
              </span>
            </div>
          </div>
          <div className="w-24 h-24 opacity-20">
            <Favorite sx={{ fontSize: 96 }} />
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Medications</p>
              <p className="text-3xl font-bold text-gray-900">{stats.activeMedications}</p>
            </div>
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
              <Medication className="text-pink-600" sx={{ fontSize: 28 }} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Adherence Rate</p>
              <p className="text-3xl font-bold text-green-600">{stats.adherenceRate.toFixed(1)}%</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-green-600" sx={{ fontSize: 28 }} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Missed Doses</p>
              <p className="text-3xl font-bold text-red-600">{stats.missedDoses}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <Cancel className="text-red-600" sx={{ fontSize: 28 }} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">AI Queries</p>
              <p className="text-3xl font-bold text-purple-600">{stats.aiQueries}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Favorite className="text-purple-600" sx={{ fontSize: 28 }} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Adherence Trend */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center mb-4">
            <TrendingUp className="text-blue-600 mr-2" sx={{ fontSize: 24 }} />
            <h2 className="text-lg font-semibold text-gray-900">Adherence Trend (7 Days)</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={adherenceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="adherence" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Medication Status */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Favorite className="text-purple-600 mr-2" sx={{ fontSize: 24 }} />
            <h2 className="text-lg font-semibold text-gray-900">Medication Status</h2>
          </div>
          <div className="flex items-center justify-center h-64 text-gray-400">
            <p>No medication status data available</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics

