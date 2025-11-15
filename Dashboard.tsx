import { useEffect, useState } from 'react'
import api from '../../services/api'
import { toast } from 'react-toastify'

interface Patient {
  id: string
  name: string
  email: string
  phone: string
  relationship: string
}

interface MedicationLog {
  id: string
  medicationName: string
  scheduledTime: string
  status: string
  takenTime?: string
}

export default function CaregiverDashboard() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null)
  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddPatient, setShowAddPatient] = useState(false)

  useEffect(() => {
    fetchPatients()
  }, [])

  useEffect(() => {
    if (selectedPatient) {
      fetchPatientLogs(selectedPatient)
    }
  }, [selectedPatient])

  const fetchPatients = async () => {
    try {
      setLoading(true)
      const response = await api.get('/caregivers/patients')
      setPatients(response.data.patients || [])
      if (response.data.patients?.length > 0) {
        setSelectedPatient(response.data.patients[0].id)
      }
    } catch (error: any) {
      console.error('Error fetching patients:', error)
      toast.error(error.message || 'Failed to load patients')
    } finally {
      setLoading(false)
    }
  }

  const fetchPatientLogs = async (patientId: string) => {
    try {
      const response = await api.get(`/caregivers/patients/${patientId}/logs`)
      setMedicationLogs(response.data.logs || [])
    } catch (error: any) {
      console.error('Error fetching logs:', error)
      toast.error(error.message || 'Failed to load medication logs')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading caregiver dashboard...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Caregiver Dashboard</h1>
        <button
          onClick={() => setShowAddPatient(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Patient
        </button>
      </div>

      {patients.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">👨‍⚕️</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No Patients Yet</h3>
          <p className="text-gray-500 mb-6">
            Start by adding a patient to monitor their medication adherence
          </p>
          <button
            onClick={() => setShowAddPatient(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Your First Patient
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="px-4 py-3 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Your Patients</h2>
              </div>
              <ul className="divide-y divide-gray-200">
                {patients.map((patient) => (
                  <li
                    key={patient.id}
                    onClick={() => setSelectedPatient(patient.id)}
                    className={`px-4 py-3 cursor-pointer hover:bg-gray-50 ${
                      selectedPatient === patient.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{patient.name}</p>
                        <p className="text-sm text-gray-500">{patient.relationship}</p>
                      </div>
                      {selectedPatient === patient.id && (
                        <span className="text-blue-600">✓</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Medication Logs */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-4 py-3 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Recent Medication Activity</h2>
              </div>
              <div className="p-4">
                {medicationLogs.length > 0 ? (
                  <ul className="space-y-3">
                    {medicationLogs.map((log) => (
                      <li key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{log.medicationName}</p>
                          <p className="text-sm text-gray-500">
                            Scheduled: {new Date(log.scheduledTime).toLocaleString()}
                          </p>
                          {log.takenTime && (
                            <p className="text-sm text-gray-500">
                              Taken: {new Date(log.takenTime).toLocaleString()}
                            </p>
                          )}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          log.status === 'taken' ? 'bg-green-100 text-green-800' :
                          log.status === 'missed' ? 'bg-red-100 text-red-800' :
                          log.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {log.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center text-gray-500 py-8">No medication logs available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddPatient && (
        <AddPatientModal
          onClose={() => setShowAddPatient(false)}
          onSuccess={() => {
            setShowAddPatient(false)
            fetchPatients()
          }}
        />
      )}
    </div>
  )
}

const AddPatientModal = ({ onClose, onSuccess }: any) => {
  const [formData, setFormData] = useState({
    patientEmail: '',
    relationship: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.post('/caregivers/patients', formData)
      toast.success('Patient added successfully')
      onSuccess()
    } catch (error: any) {
      console.error('Error adding patient:', error)
      toast.error(error.message || 'Failed to add patient')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Add Patient</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Patient Email
            </label>
            <input
              type="email"
              required
              value={formData.patientEmail}
              onChange={(e) => setFormData({ ...formData, patientEmail: e.target.value })}
              placeholder="patient@example.com"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Relationship
            </label>
            <select
              required
              value={formData.relationship}
              onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select relationship</option>
              <option value="parent">Parent</option>
              <option value="child">Child</option>
              <option value="spouse">Spouse</option>
              <option value="sibling">Sibling</option>
              <option value="friend">Friend</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
