import { useState } from 'react'
import { CloudUpload, CameraAlt, Description } from '@mui/icons-material'
import api from '../services/api'
import { toast } from 'react-toastify'

const ScanPrescription = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('prescription', selectedFile)

      await api.post('/medications/scan-prescription', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      toast.success('Prescription scanned successfully!')
      // Handle the response - medications should be added automatically
      setSelectedFile(null)
      setPreview(null)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to scan prescription')
    } finally {
      setUploading(false)
    }
  }

  const handleCameraCapture = () => {
    // This would trigger camera access
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.capture = 'environment'
    input.onchange = (e: any) => {
      handleFileSelect(e)
    }
    input.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-lg mb-4">
            <Description className="text-teal-600" style={{ fontSize: 32 }} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Prescription Scanner</h1>
          <p className="text-gray-600">
            Upload or scan your prescription to automatically add medications
          </p>
        </div>

        {/* Upload Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <CloudUpload className="mr-2 text-teal-600" />
            Upload Image
          </h2>

          {/* Drop Zone */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center mb-6 hover:border-teal-500 transition-colors">
            {preview ? (
              <div className="space-y-4">
                <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                <button
                  onClick={() => {
                    setSelectedFile(null)
                    setPreview(null)
                  }}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Description className="text-gray-400" style={{ fontSize: 64 }} />
                </div>
                <div>
                  <p className="text-gray-600 mb-2">Upload a clear photo or scan of your prescription</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <label
              htmlFor="file-upload"
              className="flex-1 flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
            >
              <CloudUpload className="mr-2" />
              Upload Image
            </label>
            <button
              onClick={handleCameraCapture}
              className="flex-1 flex items-center justify-center px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors"
            >
              <CameraAlt className="mr-2" />
              Take Photo
            </button>
          </div>

          {selectedFile && (
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full mt-4 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Processing...' : 'Process Prescription'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ScanPrescription

