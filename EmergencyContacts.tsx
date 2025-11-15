import { useEffect, useState } from 'react'
import { Add, LocalHospital, LocalPolice, LocalFireDepartment } from '@mui/icons-material'
import api from '../services/api'
import socketService from '../services/socket'
import { toast } from 'react-toastify'

const EmergencyContacts = () => {
  const [contacts, setContacts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingContact, setEditingContact] = useState<any>(null)
  const [alertActive, setAlertActive] = useState(false)

  useEffect(() => {
    fetchContacts()
    
    // Listen for emergency alerts
    socketService.on('emergency-alert', (data) => {
      console.log('Emergency alert received:', data)
      toast.success('Emergency alert sent! Help is on the way.')
    })

    return () => {
      socketService.off('emergency-alert')
    }
  }, [])

  const fetchContacts = async () => {
    try {
      const response = await api.get('/api/users/emergency-contacts')
      setContacts(response.data.contacts || [])
    } catch (error) {
      console.error('Error fetching emergency contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this emergency contact?')) {
      try {
        await api.delete(`/api/users/emergency-contacts/${id}`)
        fetchContacts()
        toast.success('Contact deleted successfully')
      } catch (error) {
        console.error('Error deleting contact:', error)
        toast.error('Failed to delete contact')
      }
    }
  }

  const handleEdit = (contact: any) => {
    setEditingContact(contact)
    setShowForm(true)
  }

  const handleEmergencyAlert = async () => {
    if (window.confirm('Are you sure you want to send an emergency alert to all your contacts?')) {
      try {
        setAlertActive(true)
        await api.post('/api/emergency/alert', {
          type: 'medical',
          message: 'Emergency alert from user',
          location: 'Current location'
        })
        toast.success('Emergency alert sent successfully!')
      } catch (error) {
        console.error('Error sending emergency alert:', error)
        toast.error('Error sending emergency alert')
      } finally {
        setAlertActive(false)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading emergency contacts...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">Emergency</h1>
        <p className="text-gray-500 mt-2">Quick access to emergency services</p>
      </div>

      {/* SOS Alert Banner */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl shadow-lg p-8">
        <button
          onClick={handleEmergencyAlert}
          disabled={alertActive}
          className="w-full bg-red-200 bg-opacity-30 hover:bg-opacity-40 rounded-xl p-6 transition-all disabled:opacity-50"
        >
          <div className="flex items-center justify-center text-white">
            <span className="text-2xl mr-3">🔔</span>
            <span className="text-2xl font-bold">Send SOS Alert</span>
          </div>
        </button>
      </div>

      {/* Emergency Services */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Emergency Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <LocalHospital className="text-red-600" sx={{ fontSize: 36 }} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Ambulance</h3>
            <p className="text-4xl font-bold text-red-600">108</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <LocalPolice className="text-blue-600" sx={{ fontSize: 36 }} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Police</h3>
            <p className="text-4xl font-bold text-blue-600">100</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <LocalFireDepartment className="text-orange-600" sx={{ fontSize: 36 }} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Fire</h3>
            <p className="text-4xl font-bold text-orange-600">101</p>
          </div>
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Emergency Contacts</h2>
          <button
            onClick={() => {
              setEditingContact(null)
              setShowForm(true)
            }}
            className="flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Add className="mr-2" sx={{ fontSize: 20 }} />
            Add Contact
          </button>
        </div>

        {showForm ? (
          <ContactForm
            contact={editingContact}
            onSuccess={() => {
              setShowForm(false)
              setEditingContact(null)
              fetchContacts()
            }}
            onCancel={() => {
              setShowForm(false)
              setEditingContact(null)
            }}
          />
        ) : (
          <div>
            {contacts.length > 0 ? (
              <ul className="space-y-3">
                {contacts.map((contact) => (
                  <li key={contact.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{contact.name}</h3>
                        <p className="text-gray-600">{contact.phone}</p>
                        <p className="text-sm text-gray-500">Relationship: {contact.relationship}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(contact)}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(contact.id)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No emergency contacts found.</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm"
                >
                  Add Your First Emergency Contact
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const ContactForm = ({ contact, onSuccess, onCancel }: any) => {
  const [formData, setFormData] = useState({
    name: contact?.name || '',
    phone: contact?.phone || '',
    relationship: contact?.relationship || '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (contact) {
        await api.put(`/api/users/emergency-contacts/${contact.id}`, formData)
        toast.success('Contact updated successfully')
      } else {
        await api.post('/api/users/emergency-contacts', formData)
        toast.success('Contact added successfully')
      }

      onSuccess()
    } catch (error: any) {
      console.error('Error saving contact:', error)
      toast.error(error.response?.data?.message || 'Error saving contact')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        {contact ? 'Edit Emergency Contact' : 'Add New Emergency Contact'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Relationship</label>
          <input
            type="text"
            required
            value={formData.relationship}
            onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EmergencyContacts
