import { useEffect, useState } from 'react'
import { Add, Medication as MedicationIcon, CheckCircle } from '@mui/icons-material'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { fetchMedications, createMedication, updateMedication, deleteMedication, logMedication } from '../store/slices/medicationSlice'
import { toast } from 'react-toastify'

export default function Medications() {
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'history'>('active')
  const [showForm, setShowForm] = useState(false)
  const [editingMedication, setEditingMedication] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: '',
    times: '',
    startDate: '',
    endDate: '',
    instructions: '',
  })

  const dispatch = useAppDispatch()
  const { medications } = useAppSelector((state) => state.medication)

  useEffect(() => {
    dispatch(fetchMedications())
  }, [dispatch])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = {
        ...formData,
        times: formData.times.split(',').map((t) => t.trim()),
      }

      if (editingMedication) {
        await dispatch(updateMedication({ id: editingMedication.id, ...data } as any)).unwrap()
        toast.success('Medication updated successfully')
    } else {
        await dispatch(createMedication(data)).unwrap()
        toast.success('Medication added successfully')
      }
      setShowForm(false)
      setEditingMedication(null)
      resetForm()
    } catch (error: any) {
      toast.error(error.message || 'Operation failed')
    }
  }

  const resetForm = () => {
      setFormData({
        name: '',
        dosage: '',
        frequency: '',
        times: '',
        startDate: '',
        endDate: '',
        instructions: '',
      })
  }

  const handleEdit = (medication: any) => {
    setEditingMedication(medication)
    setFormData({
      name: medication.name,
      dosage: medication.dosage,
      frequency: medication.frequency,
      times: medication.times?.join(', ') || '',
      startDate: medication.startDate,
      endDate: medication.endDate || '',
      instructions: medication.instructions || '',
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this medication?')) {
      try {
        await dispatch(deleteMedication(id)).unwrap()
        toast.success('Medication deleted successfully')
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete medication')
      }
    }
  }

  const handleMarkTaken = async (id: string) => {
    try {
      await dispatch(logMedication({ id, status: 'taken' })).unwrap()
      toast.success('Medication marked as taken')
    } catch (error: any) {
      toast.error(error.message || 'Failed to log medication')
    }
  }

  const filteredMedications = medications.filter((med) => {
    if (activeTab === 'active') return med.active
    if (activeTab === 'completed') return !med.active && med.endDate && new Date(med.endDate) < new Date()
    return true
  })

  const todayMedications = medications.filter((med) => med.active)
  const takenToday = 0 // TODO: Implement logic to check if medication was taken today

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
            <MedicationIcon className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Medications</h1>
            <p className="text-gray-600 mt-1">
              Manage your prescriptions and track medication intake
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setEditingMedication(null)
            resetForm()
            setShowForm(true)
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Add className="mr-2" />
          Add Medication
        </button>
      </div>

      {/* Summary Card */}
      <div className="bg-green-50 rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircle className="text-green-600 mr-3" style={{ fontSize: 32 }} />
            <div>
              <p className="text-4xl font-bold text-gray-900">{takenToday} / {todayMedications.length}</p>
              <p className="text-gray-600">Today's Medications Taken</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <div className="flex space-x-1 px-4">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'active'
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'completed'
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'history'
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              History
            </button>
          </div>
        </div>

        {/* Medications List */}
        <div className="p-6 min-h-96">
          {showForm ? (
            <MedicationForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false)
                setEditingMedication(null)
                resetForm()
              }}
              editing={!!editingMedication}
            />
          ) : filteredMedications.length > 0 ? (
            <div className="space-y-4">
              {filteredMedications.map((medication) => (
                <div key={medication.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">{medication.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">Dosage: {medication.dosage}</p>
                      <p className="text-sm text-gray-600">Frequency: {medication.frequency}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {medication.times?.map((time: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                            {time}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleMarkTaken(medication.id)}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm"
                      >
                        Mark Taken
                      </button>
                      <button
                        onClick={() => handleEdit(medication)}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(medication.id)}
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
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <MedicationIcon className="text-gray-300 mb-4" style={{ fontSize: 80 }} />
              <p className="text-lg font-medium text-gray-900">No active medications</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const MedicationForm = ({ formData, setFormData, onSubmit, onCancel, editing }: any) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Medication Name</label>
        <input
          type="text"
          required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
        <input
          type="text"
          required
            value={formData.dosage}
            onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
        <input
          type="text"
          required
            value={formData.frequency}
            onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Times (comma-separated)</label>
        <input
          type="text"
          required
            value={formData.times}
            onChange={(e) => setFormData({ ...formData, times: e.target.value })}
          placeholder="08:00, 14:00, 20:00"
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            required
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date (Optional)</label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
        <textarea
            value={formData.instructions}
            onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
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
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {editing ? 'Update' : 'Add'} Medication
        </button>
      </div>
    </form>
  )
}
