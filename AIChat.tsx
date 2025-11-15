import { useState, useRef, useEffect } from 'react'
import { Send, Mic, Chat as ChatIcon, Refresh } from '@mui/icons-material'
import api from '../services/api'

const AIChat = () => {
  const [messages, setMessages] = useState<any[]>([
    {
      role: 'assistant',
      content: "Hello! 👋 I'm your health assistant. I can help you with your medications, health advice, and medical questions. Feel free to ask me anything!",
      timestamp: new Date(),
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const suggestedQuestions = [
    "Tell me about my medications",
    "I have a headache, what should I do?",
    "Are my medications safe to take together?",
    "What should I eat when I have fever?",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await api.post('/ai/chat', {
        message: input,
        language: 'en'
      })

      const aiMessage = {
        role: 'assistant',
        content: response.data.message,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
    } catch (error: any) {
      console.error('Error sending message:', error)
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
  }

  const handleClearChat = () => {
    setMessages([{
      role: 'assistant',
      content: "Hello! 👋 I'm your health assistant. I can help you with your medications, health advice, and medical questions. Feel free to ask me anything!",
      timestamp: new Date(),
    }])
  }

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Suggested Questions */}
      <div className="bg-purple-50 rounded-xl shadow-sm p-6 border border-purple-100">
        <div className="flex items-center mb-4">
          <ChatIcon className="text-purple-600 mr-2" sx={{ fontSize: 24 }} />
          <h2 className="text-lg font-semibold text-gray-900">Suggested Questions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {suggestedQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleSuggestedQuestion(question)}
              className="flex items-center px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-purple-500 hover:shadow-md transition-all text-left"
            >
              <ChatIcon className="text-purple-600 mr-3" sx={{ fontSize: 20 }} />
              <span className="text-gray-700 text-sm">{question}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <ChatIcon className="text-white" sx={{ fontSize: 20 }} />
                </div>
              )}
              <div
                className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-purple-600 text-white rounded-br-none'
                    : 'bg-white text-gray-800 shadow-sm rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                {message.role === 'assistant' && index === messages.length - 1 && loading === false && (
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <span className="mr-2">🔊</span>
                    <span>Speaking...</span>
                  </div>
                )}
                <div className={`text-xs mt-1 ${
                  message.role === 'user' ? 'text-purple-200' : 'text-gray-400'
                }`}>
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <ChatIcon className="text-white" sx={{ fontSize: 20 }} />
              </div>
              <div className="bg-white text-gray-800 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex items-center space-x-2 mb-3">
            <button
              onClick={handleClearChat}
              className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Refresh className="mr-1" sx={{ fontSize: 16 }} />
              Clear Chat
            </button>
          </div>
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <button
              type="button"
              className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <Mic sx={{ fontSize: 24 }} />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your health question here..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send sx={{ fontSize: 24 }} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AIChat
