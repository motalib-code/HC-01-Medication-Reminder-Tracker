import { useNavigate } from 'react-router-dom'
import { ArrowForward } from '@mui/icons-material'

const Home = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 via-purple-500 to-blue-600 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full text-center">
        {/* Logo Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-32 h-32 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
            <span className="text-6xl">❤️</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
          SwasthSetu
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-white mb-6 opacity-90">
          Your Trusted Companion for Seamless Medication Management
        </p>

        {/* Description */}
        <p className="text-lg text-white mb-10 max-w-2xl mx-auto opacity-80 leading-relaxed">
          SwasthSetu is your trusted companion for seamless medication management in rural communities. Our AI-powered platform ensures that taking medications on time becomes effortless and stress-free.
        </p>

        {/* CTA Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg flex items-center gap-2 mx-auto"
        >
          Get Started
          <ArrowForward />
        </button>
      </div>
    </div>
  )
}

export default Home

