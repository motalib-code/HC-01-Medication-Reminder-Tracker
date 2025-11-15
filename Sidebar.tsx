import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { logout } from '../store/slices/authSlice'
import {
  Home,
  Dashboard as DashboardIcon,
  Medication,
  QrCodeScanner,
  Phone,
  Description,
  CalendarToday,
  Analytics,
  Notifications,
  Chat,
  Warning as Emergency,
  People,
  Logout as LogoutIcon,
  Language,
} from '@mui/icons-material'

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)

  const navigation = [
    { name: 'Home', href: '/', icon: <Home /> },
    { name: 'Dashboard', href: '/dashboard', icon: <DashboardIcon /> },
    { name: 'My Medications', href: '/medications', icon: <Medication /> },
    { name: 'Scan Prescription', href: '/scan-prescription', icon: <QrCodeScanner /> },
    { name: 'Voice Reminders', href: '/voice-reminders', icon: <Phone /> },
    { name: 'Health Records', href: '/health-records', icon: <Description /> },
    { name: 'Appointments', href: '/appointments', icon: <CalendarToday /> },
    { name: 'Analytics', href: '/analytics', icon: <Analytics /> },
    { name: 'Notifications', href: '/notifications', icon: <Notifications /> },
    { name: 'AI Assistant', href: '/ai-chat', icon: <Chat /> },
    { name: 'Emergency', href: '/emergency', icon: <Emergency /> },
    { name: 'Family Access', href: '/family-access', icon: <People /> },
  ]

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const getInitials = (name?: string) => {
    if (!name) return 'U'
    return name.charAt(0).toUpperCase()
  }

  return (
    <>
      {/* Sidebar backdrop (mobile only) */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-50 shadow-lg transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center px-4 py-6 border-b border-gray-200">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center mr-3">
              <span className="text-white text-xl">❤️</span>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">MedAssist</div>
              <div className="text-xs text-gray-500">Guardians</div>
            </div>
            <button 
              className="lg:hidden ml-auto text-gray-500 hover:text-gray-700"
              onClick={() => setSidebarOpen(false)}
            >
              ✕
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 overflow-y-auto">
            <div className="text-xs font-semibold text-gray-500 uppercase px-4 mb-2">MAIN MENU</div>
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className={`mr-3 ${isActive ? 'text-white' : 'text-gray-500'}`}>
                      {item.icon}
                    </span>
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* Language Selector */}
          <div className="px-4 py-3 border-t border-gray-200">
            <div className="flex items-center px-3 py-2 bg-white rounded-lg border border-gray-200">
              <Language className="text-gray-500 mr-2" style={{ fontSize: 18 }} />
              <select className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700">
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
              </select>
            </div>
          </div>

          {/* User Profile */}
          <div className="px-4 py-3 border-t border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center mr-3">
                <span className="text-white font-semibold">
                  {getInitials(user?.name)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-900 truncate">
                  {user?.name || 'User'}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {user?.email || 'user@example.com'}
                </div>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="px-4 py-3 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogoutIcon className="mr-3 text-gray-500" style={{ fontSize: 18 }} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
