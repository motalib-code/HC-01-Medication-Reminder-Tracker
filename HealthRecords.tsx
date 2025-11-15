import { useEffect, useState } from 'react'
import { Add, Description, Science, LocalPharmacy, Favorite, MonitorHeart, Vaccines, Visibility } from '@mui/icons-material'
import api from '../services/api'
import { toast } from 'react-toastify'

const HealthRecords = () => {
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchRecords()
  }, [])

  const fetchRecords = async () => {
    try {
      const response = await api.get('/api/users/health-records')
      setRecords(response.data.records || [])
    } catch (error) {
      console.error('Error fetching health records:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { name: 'Lab Reports', icon: <Science />, color: 'blue', count: records.filter(r => r.type === 'lab').length },
    { name: 'Prescriptions', icon: <LocalPharmacy />, color: 'green', count: records.filter(r => r.type === 'prescription').length },
    { name: 'Diagnosis', icon: <Favorite />, color: 'red', count: records.filter(r => r.type === 'diagnosis').length },
    { name: 'Vitals', icon: <MonitorHeart />, color: 'pink', count: records.filter(r => r.type === 'vitals').length },
    { name: 'Vaccination', icon: <Vaccines />, color: 'purple', count: records.filter(r => r.type === 'vaccination').length },
    { name: 'Imaging', icon: <Visibility />, color: 'blue', count: records.filter(r => r.type === 'imaging').length },
  ]

  const getColorClasses = (color: string) => {
    const colors: any = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      red: 'bg-red-100 text-red-600',
      pink: 'bg-pink-100 text-pink-600',
      purple: 'bg-purple-100 text-purple-600',
    }
    return colors[color] || 'bg-gray-100 text-gray-600'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading health records...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
            <Description className="text-green-600" sx={{ fontSize: 28 }} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Health Records</h1>
            <p className="text-gray-500 mt-1">
              Manage your medical documents and health history
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
        >
          <Add className="mr-2" sx={{ fontSize: 20 }} />
          Add Record
        </button>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <div key={category.name} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 ${getColorClasses(category.color)} rounded-xl flex items-center justify-center mx-auto mb-3`}>
              {category.icon}
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{category.count}</p>
            <p className="text-xs text-gray-600">{category.name}</p>
          </div>
        ))}
      </div>

      {/* Recent Records */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Records</h2>
          <button className="text-sm text-green-600 hover:text-green-700 font-medium">
            View All
          </button>
        </div>
        <div className="p-6 min-h-96">
          {records.length > 0 ? (
            <div className="space-y-4">
              {records.slice(0, 10).map((record) => (
                <div key={record.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{record.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(record.date).toLocaleDateString()} • {record.type}
                      </p>
                      {record.description && (
                        <p className="text-sm text-gray-500 mt-1">{record.description}</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm">
                        View
                      </button>
                      <button
                        onClick={async () => {
                          if (window.confirm('Delete this record?')) {
                            try {
                              await api.delete(`/api/users/health-records/${record.id}`)
                              toast.success('Record deleted')
                              fetchRecords()
                            } catch (error) {
                              toast.error('Failed to delete record')
                            }
                          }
                        }}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-80 text-center">
              <Description className="text-gray-300 mb-4" sx={{ fontSize: 80 }} />
              <p className="text-gray-900 mb-2">No health records found</p>
              <p className="text-gray-500 mb-6">
                Add your first health record to start tracking your medical history
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
              >
                <Add className="mr-2" sx={{ fontSize: 20 }} />
                Add Record
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <RecordForm
          onSuccess={() => {
            setShowForm(false)
            fetchRecords()
          }}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  )
}

const RecordForm = ({ onSuccess, onCancel }: any) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'medical',
    date: new Date().toISOString().split('T')[0],
    description: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.post('/api/users/health-records', {
        ...formData,
        date: new Date(formData.date).toISOString(),
      })
      toast.success('Record added successfully')
      onSuccess()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add record')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Health Record</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="medical">Medical</option>
              <option value="lab">Lab Report</option>
              <option value="prescription">Prescription</option>
              <option value="diagnosis">Diagnosis</option>
              <option value="vitals">Vitals</option>
              <option value="vaccination">Vaccination</option>
              <option value="imaging">Imaging</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              rows={4}
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
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default HealthRecords
