import { useState } from 'react'

interface User {
  name: string
  email: string
  role: string
}

interface HeaderProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  user: User | null
  onLogout: () => void
}

const Header = ({ sidebarOpen, setSidebarOpen, user, onLogout }: HeaderProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Left side - Menu button and app name */}
        <div className="flex items-center">
          <button
            className="text-gray-500 hover:text-gray-600 lg:hidden mr-3"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <span className="sr-only">Open sidebar</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-800">SwasthSetu</h1>
        </div>

        {/* Right side - User menu */}
        <div className="relative">
          <button
            className="flex items-center text-sm rounded-full focus:outline-none"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">
              {user?.name || 'User'}
            </span>
            <svg className="ml-1 w-4 h-4 text-gray-500 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div className="py-1" role="none">
                <div className="px-4 py-2 text-sm text-gray-700 border-b">
                  <p className="font-medium">{user?.name || 'User'}</p>
                  <p className="text-gray-500 text-xs">{user?.email}</p>
                  <p className="text-gray-500 text-xs capitalize">{user?.role || ''}</p>
                </div>
                <button
                  onClick={() => {
                    onLogout()
                    setDropdownOpen(false)
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header