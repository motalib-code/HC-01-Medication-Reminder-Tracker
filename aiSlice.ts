import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

interface AIMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface AIState {
  conversations: any[]
  currentConversation: AIMessage[]
  conversationId: string | null
  loading: boolean
  error: string | null
}

const initialState: AIState = {
  conversations: [],
  currentConversation: [],
  conversationId: null,
  loading: false,
  error: null,
}

export const sendMessage = createAsyncThunk(
  'ai/sendMessage',
  async ({ message, language, conversationId }: { message: string; language: string; conversationId?: string }) => {
    const response = await api.post('/ai/chat', { message, language, conversationId })
    return response.data
  }
)

export const simplifyText = createAsyncThunk(
  'ai/simplify',
  async ({ text, language }: { text: string; language: string }) => {
    const response = await api.post('/ai/simplify', { text, language })
    return response.data
  }
)

export const checkDrugInteractions = createAsyncThunk(
  'ai/drugInteractions',
  async ({ medications, language }: { medications: string[]; language: string }) => {
    const response = await api.post('/ai/drug-interactions', { medications, language })
    return response.data
  }
)

export const analyzePrescription = createAsyncThunk(
  'ai/analyzePrescription',
  async ({ prescriptionText, language }: { prescriptionText: string; language: string }) => {
    const response = await api.post('/ai/analyze-prescription', { prescriptionText, language })
    return response.data
  }
)

export const getHealthAdvice = createAsyncThunk(
  'ai/healthAdvice',
  async ({ query, symptoms, language }: { query: string; symptoms?: string[]; language: string }) => {
    const response = await api.post('/ai/health-advice', { query, symptoms, language })
    return response.data
  }
)

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    clearConversation: (state) => {
      state.currentConversation = []
      state.conversationId = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false
        state.conversationId = action.payload.conversationId
        state.currentConversation = action.payload.conversation.messages
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to send message'
      })
  },
})

export const { clearConversation, clearError } = aiSlice.actions
export default aiSlice.reducer
