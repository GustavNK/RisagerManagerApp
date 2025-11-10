'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export interface HeaderProps {
  showNavigation?: boolean
  showUserSection?: boolean
}

const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({ showNavigation = true, showUserSection = true }, ref) => {
    const [user, setUser] = useState<{ email: string } | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
      const checkLoginStatus = () => {
        const storedUser = localStorage.getItem('currentUser')
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
        setLoading(false)
      }

      checkLoginStatus()
    }, [])

    const handleLogout = () => {
      localStorage.removeItem('currentUser')
      setUser(null)
      router.push('/login')
    }

    return (
      <header ref={ref} className="bg-green-800/90 backdrop-blur-sm shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            {/* Logo and Site Name */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">🌲</span>
              </div>
              <h1 className="text-3xl font-bold text-white">Risager Plantage</h1>
            </Link>

            {/* Navigation and User Section */}
            <div className="flex items-center space-x-6">
              {loading ? (
                <div className="text-green-100">Loading...</div>
              ) : user && showUserSection ? (
                <>
                  {/* Navigation */}
                  {showNavigation && (
                    <nav className="hidden md:flex space-x-3 items-center">
                      <Link
                        href="/"
                        className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                      >
                        Hjem
                      </Link>
                      {/* <Link
                        href="/feed"
                        className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                      >
                        Familiefeed
                      </Link> */}
                      <Link
                        href="/booking"
                        className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                      >
                        Ny Booking
                      </Link>
                      <Link
                        href="/bookings"
                        className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                      >
                        Alle Bookinger
                      </Link>
                      {/* <Link
                        href="/users"
                        className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                      >
                        Brugere
                      </Link> */}
                      {/* <Link
                        href="/profile"
                        className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                      >
                        Min Profil
                      </Link> */}
                    </nav>
                  )}

                  {/* Divider */}
                  {showNavigation && (
                    <div className="hidden md:block w-px h-6 bg-green-300"></div>
                  )}

                  {/* User Section */}
                  <div className="flex items-center space-x-4">
                    <span className="text-green-100">
                      Velkommen, <span className="font-semibold">{user.email}</span>
                    </span>
                    <button
                      onClick={handleLogout}
                      className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Log ud
                    </button>
                  </div>
                </>
              ) : (
                !loading && !user && (
                  <Link
                    href="/login"
                    className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Log ind
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </header>
    )
  }
)

Header.displayName = 'Header'

export { Header }
