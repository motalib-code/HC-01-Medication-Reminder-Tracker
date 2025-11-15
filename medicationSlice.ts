import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  times: string[]
  startDate: string
  endDate?: string
  instructions?: string
  active: boolean
  createdAt: string
  updatedAt: string
}

interface MedicationState {
  medications: Medication[]
  loading: boolean
  error: string | null
}

const initialState: MedicationState = {
  medications: [],
  loading: false,
  error: null,
}

export const fetchMedications = createAsyncThunk(
  'medications/fetchMedications',
  async () => {
    const response = await api.get('/medications')
    return response.data.medications
  }
)

export const addMedication = createAsyncThunk(
  'medications/addMedication',
  async (medicationData: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post('/medications', medicationData)
    return response.data.medication
  }
)

export const updateMedication = createAsyncThunk(
  'medications/updateMedication',
  async ({ id, ...updates }: Partial<Medication> & { id: string }) => {
    const response = await api.put(`/medications/${id}`, updates)
    return response.data.medication
  }
)

export const deleteMedication = createAsyncThunk(
  'medications/deleteMedication',
  async (id: string) => {
    await api.delete(`/medications/${id}`)
    return id
  }
)

export const createMedication = createAsyncThunk(
  'medications/createMedication',
  async (medicationData: any) => {
    const response = await api.post('/medications', medicationData)
    return response.data.medication
  }
)

export const logMedication = createAsyncThunk(
  'medications/logMedication',
  async ({ id, status }: { id: string; status: string }) => {
    const response = await api.post(`/medications/${id}/log`, { status })
    return response.data
  }
)

const medicationSlice = createSlice({
  name: 'medications',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch medications
      .addCase(fetchMedications.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMedications.fulfilled, (state, action) => {
        state.loading = false
        state.medications = action.payload
      })
      .addCase(fetchMedications.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch medications'
      })
      // Add medication
      .addCase(addMedication.fulfilled, (state, action) => {
        state.medications.push(action.payload)
      })
      .addCase(addMedication.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to add medication'
      })
      // Update medication
      .addCase(updateMedication.fulfilled, (state, action) => {
        const index = state.medications.findIndex(med => med.id === action.payload.id)
        if (index !== -1) {
          state.medications[index] = action.payload
        }
      })
      .addCase(updateMedication.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update medication'
      })
      // Delete medication
      .addCase(deleteMedication.fulfilled, (state, action) => {
        state.medications = state.medications.filter(med => med.id !== action.payload)
      })
      .addCase(deleteMedication.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete medication'
      })
      // Create medication
      .addCase(createMedication.fulfilled, (state, action) => {
        state.medications.push(action.payload)
      })
      .addCase(createMedication.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create medication'
      })
      // Log medication
      .addCase(logMedication.fulfilled, () => {
        // Optionally update state based on log response
      })
      .addCase(logMedication.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to log medication'
      })
  },
})

export const { clearError } = medicationSlice.actions
export default medicationSlice.reducer