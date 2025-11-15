import { useState } from 'react'
import { Search, People } from '@mui/icons-material'
import api from '../services/api'
import { toast } from 'react-toastify'

const FamilyAccess = () => {
  const [searchEmail, setSearchEmail] = useState('')
  const [searching, setSearching] = useState(false)
  const [patients, setPatients] = useState<any[]>([])

  const handleSearch = async () => {
    if (!searchEmail.trim()) {
      toast.error('Please enter an email address')
      return
    }

    setSearching(true)
    try {
      const response = await api.post('/api/caregiver/search', { email: searchEmail })
      if (response.data.patient) {
        toast.success('Patient found! You can now access their health information.')
        // Add to patients list if not already there
        if (!patients.find(p => p.id === response.data.patient.id)) {
          setPatients([...patients, response.data.patient])
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Patient not found or not shared access')
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-3xl mb-4 shadow-lg">
          <People className="text-white" sx={{ fontSize: 48 }} />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Family Access Dashboard</h1>
        <p className="text-gray-500">
          Monitor and support your family members' health
        </p>
      </div>

      {/* Search Patient Section */}
      <div className="bg-blue-50 rounded-2xl shadow-sm p-6 border border-blue-100">
        <div className="flex items-center mb-4">
          <Search className="text-blue-600 mr-2" sx={{ fontSize: 24 }} />
          <h2 className="text-lg font-semibold text-gray-900">Search Patient by Email</h2>
        </div>
        <div className="flex gap-4">
          <input
            type="email"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            placeholder="patient@example.com"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            disabled={searching}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors disabled:opacity-50 shadow-sm"
          >
            <Search className="mr-2" sx={{ fontSize: 20 }} />
            Search
          </button>
        </div>
      </div>

      {/* My Care Recipients Section */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center mb-6">
          <People className="text-purple-600 mr-3" sx={{ fontSize: 28 }} />
          <h2 className="text-lg font-semibold text-gray-900">My Care Recipients</h2>
        </div>

        {patients.length > 0 ? (
          <div className="space-y-4">
            {patients.map((patient) => (
              <div key={patient.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-purple-600 font-semibold text-xl">
                        {patient.name?.charAt(0).toUpperCase() || 'P'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-lg">{patient.name || 'Patient'}</p>
                      <p className="text-sm text-gray-500">{patient.email}</p>
                    </div>
                  </div>
                  <button className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                    View Health Data
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="flex justify-center mb-4">
              <People className="text-gray-300" sx={{ fontSize: 96 }} />
            </div>
            <p className="text-gray-900 mb-2 text-lg">No patients assigned to you</p>
            <p className="text-gray-500 max-w-lg mx-auto">
              Ask your family member to add your email as caregiver in their profile, or search by their email address
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default FamilyAccess

